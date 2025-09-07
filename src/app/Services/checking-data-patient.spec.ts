import { TestBed } from '@angular/core/testing';
import { CheckingDataPatient } from './checking-data-patient';



describe('CheckingDataPatient', () => {
  let service: CheckingDataPatient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckingDataPatient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
