import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverageTests } from './coverage-tests';

describe('CoverageTests', () => {
  let component: CoverageTests;
  let fixture: ComponentFixture<CoverageTests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverageTests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverageTests);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
