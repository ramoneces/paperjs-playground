import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiktokTimelineComponent } from './tiktok-timeline.component';

describe('TiktokTimelineComponent', () => {
  let component: TiktokTimelineComponent;
  let fixture: ComponentFixture<TiktokTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiktokTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiktokTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
