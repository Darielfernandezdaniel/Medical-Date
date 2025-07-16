import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalInsurance } from './medical-insurance';

describe('MedicalInsurance', () => {
  let component: MedicalInsurance;
  let fixture: ComponentFixture<MedicalInsurance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalInsurance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalInsurance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
