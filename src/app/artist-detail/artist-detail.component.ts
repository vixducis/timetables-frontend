import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RatingChangeEvent } from 'angular-star-rating';
import { LastFmArtist } from 'src/classes/lastfm';
import { Show } from 'src/classes/show';
import { DbService } from '../shared/db.service';
import { HttpService } from '../shared/http.service';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit {

  public artistInfo: LastFmArtist = new LastFmArtist("Loading...", []);

  constructor(
    public dialogRef: MatDialogRef<ArtistDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public show: Show,
    private http: HttpService,
    private db: DbService
  ) { }

  ngOnInit(): void {
    this.http.getArtistInfo(this.show.artist).subscribe(
      artist => {this.artistInfo = artist;}
    );
  }

  changeStarValue(evt: RatingChangeEvent) {
    this.db.updateRating(this.show, evt.rating).subscribe(show => this.show = show);
  }

  changeComments(evt: Event) {
    this.db.updateComments(this.show, (<HTMLTextAreaElement>evt.target).value)
      .subscribe(show => this.show = show);
  }
}
