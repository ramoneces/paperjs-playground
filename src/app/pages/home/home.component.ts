import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as paper from 'paper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('stage')
  private stage!: ElementRef;
  private project!: paper.Project;

  constructor() {}

  ngAfterViewInit(): void {
    this.project = new paper.Project(this.stage.nativeElement);

    const twoPintPath = new paper.Path();
    twoPintPath.strokeColor = new paper.Color('green');
    const start = new paper.Point(100, 100);
    twoPintPath.moveTo(start);
    twoPintPath.lineTo(start.project(new paper.Point(100, -50)));

    const autoCenteringCircle = new paper.Path.Circle({
      center: this.project.view.center,
      radius: 30,
      strokeColor: 'white',
      fillColor: 'black',
    });
    autoCenteringCircle.fullySelected = true;
    this.project.view.onResize = () => {
      autoCenteringCircle.position = this.project.view.center;
    };

    const rectangle = new paper.Path.Rectangle(
      new paper.Rectangle(100, 100, 100, 100)
    );
    rectangle.fillColor = new paper.Color('white');

    const p3 = new paper.Point(1, 1).subtract(new paper.Point(1, 1));
  }

  ngOnInit(): void {}
}
