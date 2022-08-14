import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'src/classes/breadcrumb';
import { Event } from 'src/classes/event';
import { DbService } from '../shared/db.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  public event: Event;

  constructor(
    private route: ActivatedRoute,
    private db: DbService
  ) {
    this.event = route.snapshot.data['event'];
  }

  ngOnInit(): void {
  }

  public getBreadcrumbs(): Breadcrumb[] {
    return [{
      title: this.event.name,
      path: "/"+this.event.code
    }, {
      title: this.event.year.toString(),
      path: "/"+this.event.code+"/"+this.event.year
    }];
  }

  public refresh(): void {
    this.db.parseFavorites(this.event).subscribe(event => {this.event = event});
  }

}
