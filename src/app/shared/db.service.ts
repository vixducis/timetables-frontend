import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { from, map, mergeMap, Observable } from 'rxjs';
import { ShowDb } from 'src/classes/show';
import { exportDB } from "dexie-export-import";
import { Event } from 'src/classes/event';


@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie{
  shows!: Table<ShowDb, number>;
  
  constructor() {
    super("DexieDB");

    this.version(1).stores({
      shows: 'id, favorite'
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
}
