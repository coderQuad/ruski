import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterGameComponent } from './enter-game.component';

describe('EnterGameComponent', () => {
  let component: EnterGameComponent;
  let fixture: ComponentFixture<EnterGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
