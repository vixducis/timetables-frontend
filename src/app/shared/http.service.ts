import { Injectable } from '@angular/core';
import { FestivalJson } from 'src/classes/festival';
import { HttpClient } from "@angular/common/http";
import { from, map, mergeMap, Observable } from 'rxjs';
import { Event, EventJson } from 'src/classes/event';
import { YearsJson } from 'src/classes/years';
import { DbService } from './db.service';
import { ILastFmArtist, LastFmArtist, LastFmResponse } from 'src/classes/lastfm';

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  private readonly baseUrl = 'https://www.wouterh.be/timetable/festivals/';
  private readonly lastfmBaseUrl = 'https://ws.audioscrobbler.com/2.0/';
  private readonly lastfmKey = 'xxx';

  constructor(
    private http: HttpClient,
    private db: DbService
  ) {
  }

  getFestivals(): Observable<FestivalJson[]> {
    return this.http.get<FestivalJson[]>(this.baseUrl);
  }

  getEditions(code: string): Observable<YearsJson> {
    return this.http.get<YearsJson>(this.baseUrl+code);
  }

  getEvent(code: string, year: number): Observable<Event> {
    return this.http.get<EventJson>(this.baseUrl+code+"/"+year).pipe(
      mergeMap(eventJson => {
        return this.db.parseFavorites(Event.fromJson(eventJson)).pipe(
          mergeMap(event => this.db.parseStages(event))
        );
      })
    );
  }

  getArtistInfo(artist: string): Observable<LastFmArtist> {
    return this.http.get<LastFmResponse>(
      this.lastfmBaseUrl+"?method=artist.getinfo&artist="+artist
      +"&api_key="+this.lastfmKey+"&format=json"
    ).pipe(map(response => {
      if("error" in response) {
        return new LastFmArtist();
      } else {
        return LastFmArtist.fromJson(<ILastFmArtist>response);
      }
    }));
  }
}
