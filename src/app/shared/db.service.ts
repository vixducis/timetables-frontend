import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { from, map, mergeMap, Observable } from 'rxjs';
import { Show, ShowDb } from 'src/classes/show';
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
        return found === undefined
          ? from(this.table(table).add({id: showId, favorite: true})).pipe(
            map(() => true)
          )
          : from(this.table(table).update(found.id, {favorite: !found.favorite})).pipe(
            map(() => !found.favorite)
          );
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
    return from(
      this.table('shows').where('id').anyOf(showIds).toArray()
    ).pipe(
      map((dbShows: ShowDb[]) => {
        for(let i = 0; i < event.days.length; i++) {
          for(let j = 0; j < event.days[i].stages.length; j++) {
            for(let k = 0; k < event.days[i].stages[j].shows.length; k++) {
              for(let l = 0; l < dbShows.length; l++) {
                if(dbShows[l].id === event.days[i].stages[j].shows[k].id) {
                  event.days[i].stages[j].shows[k].favorite = dbShows[l].favorite;
                  event.days[i].stages[j].shows[k].rating = dbShows[l].rating ?? null;
                  event.days[i].stages[j].shows[k].comments = dbShows[l].comment ?? '';
                }
              }
            }
          }
        }
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

  public updateRating(show: Show, rating: number): Observable<Show> {
    const table = 'shows';
    return from(this.table(table).get(show.id)).pipe(
      mergeMap((found: ShowDb) => {
        return from(found === undefined
          ? this.table(table).add({id: show.id, rating, favorite: false})
          : this.table(table).update(found.id, {rating})
        ).pipe(
          map(() => {
            show.rating = rating;
            return show;
          })
        )
      })
    );
  }

  public updateComments(show: Show, comment: string): Observable<Show> {
    const table = 'shows';
    return from(this.table(table).get(show.id)).pipe(
      mergeMap((found: ShowDb) => {
        return from(found === undefined
          ? this.table(table).add({id: show.id, comment, favorite: false})
          : this.table(table).update(found.id, {comment})
        ).pipe(
          map(() => {
            show.comments = comment;
            return show;
          })
        )
      })
    );
  }
}
