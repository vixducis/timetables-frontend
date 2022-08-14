import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { YearsJson } from 'src/classes/years';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class YearsResolver implements Resolve<YearsJson> {
  constructor(private http: HttpService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<YearsJson> {
    return this.http.getEditions(route.paramMap.get('code') ?? '');
  }
}
