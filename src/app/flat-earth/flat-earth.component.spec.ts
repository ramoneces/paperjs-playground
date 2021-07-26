import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatEarthComponent } from './flat-earth.component';

describe('GamePageComponent', () => {
  let component: FlatEarthComponent;
  let fixture: ComponentFixture<FlatEarthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlatEarthComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatEarthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
