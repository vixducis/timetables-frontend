import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventDay } from 'src/classes/eventday';
import { Show } from 'src/classes/show';
import { Stage } from 'src/classes/stage';
import { ArtistDetailComponent } from '../artist-detail/artist-detail.component';

@Component({
  selector: 'app-favorites-day',
  templateUrl: './favorites-day.component.html',
  styleUrls: ['./favorites-day.component.scss']
})
export class FavoritesDayComponent implements OnInit {

  @Input() day!: EventDay;
  favorites: {show: Show, stage: Stage}[] = [];

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  public getFavorites(): {show: Show, stage: Stage}[] {
    return this.day.stages.map(stage => stage.shows.filter(
      show => show.favorite === true
    ).map(
      show => { return {show, stage} }
    )).flat().sort((a,b) => Show.sortFn(a.show, b.show));
  }

  public openArtistDetail(show: Show) {
    this.dialog.open(ArtistDetailComponent, {
      data: show,
      maxHeight: '90vh'
    });
  }

}
