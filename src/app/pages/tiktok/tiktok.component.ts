import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Point } from 'paper/dist/paper-core';

@Component({
  selector: 'app-tiktok',
  templateUrl: './tiktok.component.html',
  styleUrls: ['./tiktok.component.css'],
})
export class TiktokComponent implements AfterViewInit {
  data: any;
  fileName: string = 'choose a file';
  @ViewChild('stage')
  private stage!: ElementRef;
  project!: paper.Project;
  timelineStops!: paper.Group;
  timeline!: paper.Path.Rectangle;
  selectedTimelineStop?: paper.Path;
  lastMousePosition?: paper.Point = undefined;

  constructor() {}

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const fullPath = inputNode.value;
        let fileName = '';
        if (fullPath) {
          const startIndex =
            fullPath.indexOf('\\') >= 0
              ? fullPath.lastIndexOf('\\')
              : fullPath.lastIndexOf('/');
          fileName = fullPath.substring(startIndex);
          if (fileName.indexOf('\\') === 0 || fileName.indexOf('/') === 0) {
            fileName = fileName.substring(1);
          }
        }
        this.fileLoaded(JSON.parse(e.target.result), fileName);
      };

      reader.readAsText(inputNode.files[0]);
    }
  }

  ngAfterViewInit(): void {
    const project = new paper.Project(this.stage.nativeElement);
    this.project = project;
    project.activate();
    const layer1 = new paper.Layer();
    layer1.activate();

    this.timelineStops = new paper.Group();

    this.timeline = new paper.Path.Rectangle({
      point: new paper.Point(0, 0),
      size: this.project.view.viewSize,
    });

    project.view.onResize = () => {
      this.timeline.bounds.set({
        point: new paper.Point(0, 0),
        size: this.project.view.viewSize,
      });
    };

    project.view.onFrame = () => {
      // console.log('on frame');
      if (this.lastMousePosition) {
        this.timelineStops.children.forEach((item: paper.Item) => {
          const line = item as paper.Path;
          if (!item.data.pinned) {
            const start = line.segments[0].point;
            const end = line.segments[1].point;
            const initialX: number = item.data.initialX;
            const xDisplacementToMouse = this.lastMousePosition.x - start.x;
            const xDistanceToMouse = Math.abs(xDisplacementToMouse);
            const xDisplacementToInitial = initialX - start.x;
            const xDistanceToInitial = Math.abs(xDisplacementToInitial);
            const maxSpeed = 0.05;
            if (xDistanceToMouse < 50 && xDistanceToInitial < 50) {
              //  Repulsion from mouse
              const xDisplacement = -maxSpeed * xDisplacementToMouse;
              start.x += xDisplacement;
              end.x += xDisplacement;
            } else {
              //  Attraction to initial x
              const xDisplacement = maxSpeed * xDisplacementToInitial;
              start.x += xDisplacement;
              end.x += xDisplacement;
            }
          }
        });
      }
    };

    project.view.onMouseDown = (event: paper.MouseEvent) => {
      const clickedLine = this.timelineStops.children.find((line) =>
        line.hitTest(event.point)
      ) as paper.Path;

      if (clickedLine) {
        clickedLine.data.pinned = !clickedLine.data.pinned;
        clickedLine.set({
          strokeColor: clickedLine.data.pinned ? '#56a36b' : '#89457f',
          strokeWidth: clickedLine.data.pinned ? 5 : 0.5,
        });
      }
    };

    project.view.onMouseMove = (event: paper.MouseEvent) => {
      this.lastMousePosition = event.point;
      // if (this.selectedTimelineStop) {
      //   this.selectedTimelineStop.set({
      //     strokeColor: '#89457f',
      //     strokeWidth: 0.5,
      //   });
      // }

      // this.selectedTimelineStop = this.timelineStops.children.find((line) =>
      //   line.hitTest(event.point)
      // ) as paper.Path;
      // if (this.selectedTimelineStop) {
      //   this.selectedTimelineStop.bringToFront();
      //   this.selectedTimelineStop.set({
      //     strokeColor: '#56a36b',
      //     strokeWidth: 5,
      //   });
      //   this.selectedTimelineStop;
      // }
    };
  }

  fileLoaded(data: any, filenName: string) {
    this.data = data;
    this.fileName = filenName;

    const jsonComments = data.Comment.Comments.CommentsList;
    const comments: { date: Date; comment: string }[] = jsonComments.map(
      (item: any) => {
        return {
          date: new Date(item.Date),
          comment: item.Comment,
        };
      }
    );
    comments.sort((a, b) => (a.date > b.date ? 1 : -1));

    const minTime = comments[0].date.getTime();
    const maxTime = comments[comments.length - 1].date.getTime();
    const intervalTime = maxTime - minTime;

    this.timelineStops.removeChildren();
    comments.forEach((comment) => {
      const x =
        ((comment.date.getTime() - minTime) / intervalTime) *
        this.project.view.bounds.width;

      const start = new paper.Point(x, this.timeline.bounds.top);
      const end = new paper.Point(x, this.timeline.bounds.bottom);
      this.timelineStops.addChild(
        new paper.Path({
          segments: [start, end],
          strokeWidth: 0.5,
          strokeColor: '#89457f',
          strokeCap: 'round',
          data: { initialX: start.x },
        })
      );
    });
  }
}
