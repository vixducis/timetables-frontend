import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from 'src/classes/breadcrumb';
import { YearsJson } from 'src/classes/years';

@Component({
  selector: 'app-years',
  templateUrl: './years.component.html',
  styleUrls: ['./years.component.scss']
})
export class YearsComponent implements OnInit {

  public event: YearsJson;

  constructor(
    private route: ActivatedRoute
  ) {
    this.event = route.snapshot.data['event'];
  }

  ngOnInit(): void {
  }

  public getBreadcrumbs(): Breadcrumb[] {
    return [{
      title: this.event.name,
      path: "/"+this.event.code
    }];
  }

}
