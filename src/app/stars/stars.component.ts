import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as paper from 'paper';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
})
export class StarsComponent implements AfterViewInit {
  @ViewChild('stage')
  private stage!: ElementRef;

  constructor() {}

  ngAfterViewInit(): void {
    const project = new paper.Project(this.stage.nativeElement);
    project.activate();
    const layer1 = new paper.Layer();
    layer1.activate();

    const star = new paper.Path.Star(new paper.Point(0, 0), 7, 10, 5);
    star.style = new paper.Style({
      fillColor: new paper.Color('white'),
    });
    const starSymbol = new paper.SymbolDefinition(star);

    const numberOfStars = 100;
    const stars: paper.SymbolItem[] = [];
    for (let index = 0; index < numberOfStars; index++) {
      const placedStar = starSymbol.place(
        paper.Point.random().multiply(project.view.bounds.bottomRight)
      );
      const scale = index / numberOfStars;
      placedStar.scale(scale);
      placedStar.rotate(Math.random() * 360);
      placedStar.data.scale = scale;
      placedStar.data.id = index + 1;
      placedStar.opacity = scale;

      stars.push(placedStar);
    }

    const mouseTool = new paper.Tool();
    mouseTool.activate();

    const nameArrow = new paper.Path([
      new paper.Point(0, 0),
      new paper.Point(15, -15),
    ]);
    nameArrow.strokeColor = new paper.Color('white');
    const nameText = new paper.PointText({
      point: new paper.Point(15, -15),
      justification: 'center',
      fontSize: 10,
      fillColor: 'white',
    });
    const tag = new paper.Group([nameArrow, nameText]);
    tag.pivot = new paper.Point(0, 0);
    tag.opacity = 0;
    let hoveredStar: paper.SymbolItem | undefined;
    mouseTool.onMouseMove = (event: paper.ToolEvent) => {
      stars.forEach((star) => {
        event.delta &&
          star.translate(event.delta.multiply(-1 * star.data.scale));
        if (star.position.x < 0)
          star.position.x = project.view.size.width + star.position.x;
        else if (star.position.x > project.view.size.width)
          star.position.x = star.position.x - project.view.size.width;
        if (star.position.y < 0)
          star.position.y = project.view.size.height + star.position.y;
        else if (star.position.y > project.view.size.height)
          star.position.y = star.position.y - project.view.size.height;

        if (star.hitTest(event.point)) {
          hoveredStar = star;
        }
      });
      if (hoveredStar) {
        hoveredStar.style = new paper.Style({
          strokeColor: new paper.Color('red'),
        });
        tag.position = hoveredStar.position;

        nameText.content = `${hoveredStar.data.id}`;
        tag.opacity = 1;
      } else {
        // tag.opacity = 0;
      }
    };
  }
}
