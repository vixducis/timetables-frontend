import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from './event/event.component';
import { FestivalsComponent } from './festivals/festivals.component';
import { EventResolver } from './shared/event.resolver';
import { YearsResolver } from './shared/years.resolver';
import { YearsComponent } from './years/years.component';

const routes: Routes = [
  {path: '', component: FestivalsComponent},
  {
    path: ':code', 
    component: YearsComponent,
    resolve: {event: YearsResolver}
  },
  {
    path: ':code/:year', 
    component: EventComponent,
    resolve: {event: EventResolver}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
