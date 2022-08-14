import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Breadcrumb } from 'src/classes/breadcrumb';
import { DbService } from '../shared/db.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() breadcrumbs: Breadcrumb[] = [];
  @Output() refresh = new EventEmitter<null>();

  constructor(
    private db: DbService
  ) { }

  ngOnInit(): void {
  }

  public getBreadcrumbs(): Breadcrumb[] {
    let output = [{
      path: '/',
      title: 'Festivals'
    }];
    return output.concat(this.breadcrumbs);
  }

  public saveFile() {
    this.db.exportDatabase().subscribe(blob => {
      const downloadAncher = document.createElement("a");
      downloadAncher.style.display = "none";

      const fileURL = URL.createObjectURL(blob);
      downloadAncher.href = fileURL;
      downloadAncher.download = "timetables.txt";
      downloadAncher.click();
    });
  }

  public importFile(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files !== null) {
      this.db.import(files[0]).then(() => {
        this.refresh.emit(null);
      });
    }
  }

}
