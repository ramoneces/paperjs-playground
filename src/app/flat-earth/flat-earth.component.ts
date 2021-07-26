import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as paper from 'paper';

@Component({
  selector: 'app-flat-earth',
  templateUrl: './flat-earth.component.html',
  styleUrls: ['./flat-earth.component.scss'],
})
export class FlatEarthComponent implements AfterViewInit {
  @ViewChild('stage')
  private stage!: ElementRef;
  private project: paper.Project;

  constructor() {}

  ngAfterViewInit(): void {
    this.setupProject();

    this.renderBackground();

    // this.renderWorld();
    this.renderWorld2();
  }

  renderWorld2() {
    const worldLayer = new paper.Layer({ name: 'world' });
    worldLayer.activate();
    let mergedRegions: paper.PathItem;
    for (let index = 0; index < 100; index++) {
      const radius = 20 + Math.random() * 150;
      const sidesFactor = (radius * 2) / this.project.view.size.height;
      const sides = Math.floor(100 * sidesFactor);
      const center = paper.Point.random()
        .multiply(this.project.view.bounds.bottomRight.subtract(radius * 2))
        .add(radius);
      const region = new paper.Path.RegularPolygon(center, sides, radius);
      region.segments.forEach(
        (segment) =>
          (segment.point = segment.point.add(
            paper.Point.random().subtract(0.5).multiply(10)
          ))
      );
      mergedRegions = mergedRegions?.unite(region) || region;
    }
    const world = this.getWorldFromMergedRegions(mergedRegions);
    world.fillColor = new paper.Color('#fabada');
    // console.log(world);
    worldLayer.removeChildren();
    worldLayer.addChild(world);

    world.onClick = (event: paper.MouseEvent) => {
      this.renderPath(world, event.point);
    };

    // finalRegion.smooth();
    // finalRegion.simplify();
  }

  getWorldFromMergedRegions(world: paper.PathItem): paper.Path {
    if (world instanceof paper.Path) {
      return world;
    } else {
      let biggestChild = world.firstChild as paper.Path;
      for (let i = 1; i < world.children.length; i++) {
        const child = world.children[i] as paper.Path;
        if (child.area > biggestChild.area) {
          biggestChild = child;
        }
      }

      return biggestChild;
    }
  }

  renderPath(world: paper.Path, point: paper.Point) {
    const road = new paper.Path();
    road.strokeColor = new paper.Color('black');
    const nearestPoint = world.getNearestLocation(point).point;

    let direction = point.subtract(nearestPoint).normalize();

    let maxAngleVariation = 40;
    let segmentLength = 10;

    road.moveTo(nearestPoint);
    let prevPoint = nearestPoint;
    let crossesWorld = false;
    while (!crossesWorld) {
      direction.angle += (Math.random() - 0.5) * 2 * maxAngleVariation;
      const newPoint = prevPoint.add(direction.multiply(segmentLength));

      road.lineTo(newPoint);
      crossesWorld = road.getCrossings(world).length > 0;
      prevPoint = newPoint;
    }
    road.smooth();
  }

  private debugPoint(point: paper.Point, color: string) {
    return;
    new paper.Shape.Circle({
      center: point,
      radius: 2,
      fillColor: new paper.Color(color),
    });
  }

  renderWorld() {
    const worldLayer = new paper.Layer({ name: 'world' });
    worldLayer.activate();

    const colors = [
      'Red',
      'Maroon',
      'Yellow',
      'Olive',
      'Lime',
      'Green',
      'Aqua',
      'Teal',
      'Blue',
      'Nav',
    ];

    const terrain = this.createTerrainLayer(colors[0]);
    const terrains = [terrain];
    let scale = 1;
    let simplification = this.project.view.size.height * 0.1;
    for (let i = 1; i < 10; i++) {
      scale -= 0.1;
      simplification *= scale;
      const iTerrain = terrain.clone();
      iTerrain.fillColor = new paper.Color(colors[i]);
      iTerrain.scale(scale);
      iTerrain.smooth();
      iTerrain.simplify(simplification);
      iTerrain.flatten(simplification);
      terrains.push(iTerrain);
    }
    const world = new paper.Group(terrains);
    world.bounds.center = this.project.view.center;
  }

  private createTerrainLayer(color: string) {
    const terrainLayer = new paper.Path({
      fillColor: new paper.Color(color),
    });

    const origin = new paper.Point(0, 0);
    let lastPoint = this.project.view.bounds.leftCenter.multiply(0.95);
    const length = lastPoint.length;
    terrainLayer.moveTo(lastPoint);
    let angle = 0;
    const maxAngleVariation = 20;
    const maxRadiusVariation = 30;
    while (angle < 360) {
      const deltaAngle = Math.min(
        maxAngleVariation * Math.random(),
        360 - angle
      );
      const nextPoint = lastPoint.rotate(deltaAngle, origin);
      nextPoint.length = length + maxRadiusVariation * (Math.random() - 0.5);
      terrainLayer.lineTo(nextPoint);
      angle += deltaAngle;
      lastPoint = nextPoint;
    }
    terrainLayer.closePath();
    return terrainLayer;
  }

  private renderBackground() {
    const backgroundLayer = new paper.Layer({ name: 'background' });
    backgroundLayer.activate();

    const star = new paper.Path.Star(new paper.Point(0, 0), 7, 4, 2);

    const starColor = new paper.Color('white');
    star.style = new paper.Style({
      fillColor: starColor,
    });
    star.shadowColor = starColor;
    star.shadowBlur = 10;
    star.shadowOffset = new paper.Point(0, 0);

    const starSymbol = new paper.SymbolDefinition(star);

    const numberOfStars = 100;
    const stars: paper.SymbolItem[] = [];
    for (let index = 0; index < numberOfStars; index++) {
      const placedStar = starSymbol.place(
        paper.Point.random().multiply(this.project.view.bounds.bottomRight)
      );
      const scale = index / numberOfStars;
      placedStar.scale(scale);
      placedStar.rotate(Math.random() * 360);
      placedStar.data.scale = scale;
      placedStar.data.id = index + 1;
      placedStar.opacity = scale;

      stars.push(placedStar);
    }

    this.project.view.on('mousemove', (event: paper.ToolEvent) => {
      stars.forEach((star) => {
        event.delta &&
          star.translate(event.delta.multiply(-star.data.scale * 0.02));
        if (star.position.x < 0)
          star.position.x = this.project.view.size.width + star.position.x;
        else if (star.position.x > this.project.view.size.width)
          star.position.x = star.position.x - this.project.view.size.width;
        if (star.position.y < 0)
          star.position.y = this.project.view.size.height + star.position.y;
        else if (star.position.y > this.project.view.size.height)
          star.position.y = star.position.y - this.project.view.size.height;
      });
    });
    this.project.view.on('frame', (event: paper.ToolEvent) => {
      stars.forEach((star) => {
        star.opacity += Math.random() - 0.5 * (1 - star.data.scale);
      });
    });
  }

  private setupProject() {
    this.project = new paper.Project(this.stage.nativeElement);
    this.project.activate();
  }
}
