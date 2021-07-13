import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'paperjs-playground';
  isShowingMenu = false;

  constructor(private router: Router) {}
  navigate(slug: string) {
    this.router.navigate([slug]);
    this.isShowingMenu = false;
  }
}
