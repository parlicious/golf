import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradePage } from './upgrade.page';

describe('UpgradePage', () => {
  let component: UpgradePage;
  let fixture: ComponentFixture<UpgradePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
