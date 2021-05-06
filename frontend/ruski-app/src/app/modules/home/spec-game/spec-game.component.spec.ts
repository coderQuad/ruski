import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecGameComponent } from './spec-game.component';

describe('SpecGameComponent', () => {
  let component: SpecGameComponent;
  let fixture: ComponentFixture<SpecGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
