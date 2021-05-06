import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndivGameComponent } from './indiv-game.component';

describe('IndivGameComponent', () => {
  let component: IndivGameComponent;
  let fixture: ComponentFixture<IndivGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndivGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndivGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
