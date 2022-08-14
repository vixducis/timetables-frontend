import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, map, mergeMap } from 'rxjs';
import { EventDay } from 'src/classes/eventday';
import { Show } from 'src/classes/show';
import { Stage } from 'src/classes/stage';
import { ArtistDetailComponent } from '../artist-detail/artist-detail.component';
import { DbService } from '../shared/db.service';

@Component({
  selector: 'app-day[day]',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {

  @Input() day!: EventDay;
  stageSelect = new FormControl<number[]|null>(null);

  constructor(
    private db: DbService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.stageSelect.setValue(this.getSelectedStageIds());
    this.stageSelect.valueChanges.subscribe(newIds => {
      if (newIds !== null) {
        const previousIds = this.getSelectedStageIds();
        const changedIds = previousIds.filter(x => !newIds.includes(x))
          .concat(newIds.filter(x => !previousIds.includes(x)));
        forkJoin(
          changedIds.map(stageId => this.db.changeStage(stageId, this.day.getIdentifier()))
        ).pipe(
          mergeMap(() => this.db.parseStagesDay(this.day))
        ).subscribe(day => {this.day = day});
      }
    });
  }

  public addFavorite(show: Show): void {
    this.db.changeFavorite(show.id).subscribe(favorite => {show.favorite = favorite});
  }

  public getSelectedStageIds(): number[] {
    return this.day.stages.filter(stage => stage.shown).map(stage => stage.id);
  }

  public openArtistDetail(show: Show) {
    let dialogRef = this.dialog.open(ArtistDetailComponent, {
      data: show,
      maxHeight: '90vh'
    });
  }

  fullStarsArray(rating: number|null): [] {
    return [].constructor(Math.floor(rating??0));
  }

}
