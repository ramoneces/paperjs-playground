import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DraftComponent } from './pages/draft/draft.component';
import { HomeComponent } from './pages/home/home.component';
import { TiktokComponent } from './pages/tiktok/tiktok.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'draft', component: DraftComponent },
  { path: 'tiktok', component: TiktokComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
