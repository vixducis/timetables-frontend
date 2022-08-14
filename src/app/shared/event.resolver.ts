import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Event } from 'src/classes/event';

@Injectable({
  providedIn: 'root'
})
export class EventResolver implements Resolve<Event> {
  constructor(private http: HttpService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Event> {
    return this.http.getEvent(
      route.paramMap.get('code') ?? '',
      parseInt(route.paramMap.get('year') ?? '')
    );
  }
}
