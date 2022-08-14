import { Component, OnInit } from '@angular/core';
import { FestivalJson } from 'src/classes/festival';
import { HttpService } from '../shared/http.service';

@Component({
  selector: 'app-festivals',
  templateUrl: './festivals.component.html',
  styleUrls: ['./festivals.component.scss']
})
export class FestivalsComponent implements OnInit {

  public festivals: FestivalJson[] = [];

  constructor(
    private http: HttpService
  ) { }

  ngOnInit(): void {
    this.http.getFestivals().subscribe(festivals => this.festivals = festivals);
  }

}
