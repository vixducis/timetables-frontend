import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-rating-view',
  templateUrl: './rating-view.component.html',
  styleUrls: ['./rating-view.component.scss']
})
export class RatingViewComponent implements OnInit {

  @Input() rating: number = 0;
  @Input() size: number = 16;

  constructor() { }

  ngOnInit(): void {
  }
  
  public fullStarsArray(): [] {
    return [].constructor(Math.floor(this.rating));
  }
}
