import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventDay } from 'src/classes/eventday';
import { Show } from 'src/classes/show';
import { Stage } from 'src/classes/stage';
import { DbService } from '../shared/db.service';

@Component({
  selector: 'app-day[day]',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {

  @Input() day!: EventDay;
  stageSelect = new FormControl<string[]|null>(null);

  constructor(
    private db: DbService
  ) {}

  ngOnInit(): void {
    this.stageSelect.setValue(this.day.stages.map(stage => stage.name));
  }

  public getStageNames(): string[] {
    return this.day.stages.map(stage => stage.name);
  }

  public getStages(): Stage[] {
    return this.day.stages.filter(stage => this.stageSelect.value?.includes(stage.name));
  }

  public addFavorite(show: Show): void {
    this.db.changeFavorite(show.id).subscribe(favorite => {show.favorite = favorite});
  }

}
