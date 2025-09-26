import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientArea } from './patient-area';

describe('PatientArea', () => {
  let component: PatientArea;
  let fixture: ComponentFixture<PatientArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
