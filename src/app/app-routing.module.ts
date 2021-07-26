import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DraftsComponent } from './drafts/drafts.component';
import { FlatEarthComponent } from './flat-earth/flat-earth.component';
import { StarsComponent } from './stars/stars.component';
import { TiktokTimelineComponent } from './tiktok-timeline/tiktok-timeline.component';

const routes: Routes = [
  { path: '', redirectTo: '/stars', pathMatch: 'full' },
  { path: 'stars', component: StarsComponent },
  { path: 'flat-earth', component: FlatEarthComponent },
  { path: 'drafts', component: DraftsComponent },
  { path: 'tiktok-timeline', component: TiktokTimelineComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
