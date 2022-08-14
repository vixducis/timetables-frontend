import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { from, map, mergeMap, Observable } from 'rxjs';
import { ShowDb } from 'src/classes/show';
import { exportDB } from "dexie-export-import";
import { Event } from 'src/classes/event';
import { StageDb } from 'src/classes/stage';
import { EventDay } from 'src/classes/eventday';


@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie{
  shows!: Table<ShowDb, number>;
  stages!: Table<StageDb, number>
  
  constructor() {
    super("DexieDB");

    this.version(2).stores({
      shows: 'id, favorite',
      stages: '++id, [stage_id+date]'
    });

    this.open();
  }

  changeFavorite(showId: number): Observable<boolean> {
    const table = 'shows';
    return from(this.table(table).get(showId)).pipe(
      mergeMap((found: ShowDb) => {
        const favorite = found === undefined ? true : !found.favorite;
        return from(this.table(table).put({id: showId, favorite})).pipe(
          map(() => favorite)
        )
      })
    );
  }

  changeStage(stageId: number, date: string) {
    const table = 'stages';
    return from(
      this.table(table).where('[stage_id+date]').equals([stageId,date]).first()
    ).pipe(
      mergeMap((found: StageDb) => {
        return found === undefined
          ? from(
            this.table(table).add({stage_id: stageId, date, shown: false})
          ).pipe(map(() => false))
          : from(
            this.table(table).update(found.id, {shown: !found.shown})
          ).pipe(map(() => !found.shown));
      })
    );
  }

  public exportDatabase(): Observable<Blob> {
    return from(exportDB(this));
  }

  parseFavorites(event: Event): Observable<Event> {
    const showIds = event.days.map(
      day => day.stages.map(stage => stage.shows.map(show => show.id))
    ).flat().flat();
    return from(this.table('shows').where('id').anyOf(showIds)
      .and(item => item.favorite == true).primaryKeys()
    ).pipe(
      map(favoriteIds => {
        event.days.map(day => {day.stages.map(stage => {
          stage.shows.map(show => {
            if(favoriteIds.includes(show.id)) {
              show.favorite = true;
            }
          })
        })})
        return event;
      })
    )
  }

  parseStages(event: Event): Observable<Event> {
    const stageIds = event.days.map(day => day.stages.map(stage => 
      [stage.id, day.getIdentifier()]
    )).flat();
    
    return from(this.table("stages").where('[stage_id+date]').anyOf(stageIds).toArray()).pipe(
      map((dbStages: StageDb[]) => {
        for(let i = 0; i < event.days.length; i++) {
          this.assignStageState(event.days[i], dbStages);
        }
        return event;
      })
    )
  }

  parseStagesDay(day: EventDay): Observable<EventDay> {
    const stageIds = day.stages.map(stage => [stage.id, day.getIdentifier()]);
    return from(this.table("stages").where('[stage_id+date]').anyOf(stageIds).toArray()).pipe(
      map((dbStages: StageDb[]) => this.assignStageState(day, dbStages))
    );
  }

  private assignStageState(day: EventDay, dbStages: StageDb[]): EventDay {
    for(let i = 0; i < day.stages.length; i++) {
      for(let j = 0; j < dbStages.length; j++) {
        if(
          dbStages[j].stage_id === day.stages[i].id
          && dbStages[j].date === day.getIdentifier()
        ) {
          day.stages[i].shown = dbStages[j].shown;
          break;
        }
      }
    }
    return day;
  }
}
