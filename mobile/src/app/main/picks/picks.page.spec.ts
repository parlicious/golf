import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicksPage } from './picks.page';

describe('PicksPage', () => {
  let component: PicksPage;
  let fixture: ComponentFixture<PicksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicksPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
