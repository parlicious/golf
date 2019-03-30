import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreboardPage } from './scoreboard.page';

describe('ScoreboardPage', () => {
  let component: ScoreboardPage;
  let fixture: ComponentFixture<ScoreboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreboardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
