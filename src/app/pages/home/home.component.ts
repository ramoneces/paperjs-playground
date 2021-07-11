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
    const layer1 = this.project.addLayer(new paper.Layer());
    const layer2 = this.project.addLayer(new paper.Layer());

    layer2.activate();

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
      //constant height
      this.project.view.viewSize.height = 500;
      autoCenteringCircle.position = this.project.view.center;
    };

    const rectangle = new paper.Path.Rectangle(
      new paper.Rectangle(100, 100, 100, 100)
    );
    rectangle.fillColor = new paper.Color('white');

    const p3 = new paper.Point(1, 1).subtract(new paper.Point(1, 1));

    // The brush applies to the lower layer
    const brush = new paper.Tool();
    brush.onMouseUp = (event: paper.ToolEvent) => {
      const textStart = new paper.PointText({
        point: event.downPoint,
        justification: 'center',
        fontSize: 10,
        fillColor: 'white',
      });
      textStart.content = `(${event.downPoint.x},${event.downPoint.y})`;
      const textend = new paper.PointText({
        point: event.point,
        justification: 'center',
        fontSize: 10,
        fillColor: 'white',
      });
      console.log('intersects', textStart.bounds.intersects(textend.bounds));
      textend.content = `(${event.point.x},${event.point.y})`;
    };
    brush.onMouseDrag = (event: paper.ToolEvent) => {
      layer1.activate();
      const circle = new paper.Path.Circle({
        center: event.middlePoint,
        radius: event.delta.length / 2,
        fillColor: 'yellow',
      });
    };
    brush.activate();
  }

  ngOnInit(): void {}
}
