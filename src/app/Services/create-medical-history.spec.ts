import { TestBed } from '@angular/core/testing';

import { CreateMedicalHistory } from './create-medical-history';

describe('CreateMedicalHistory', () => {
  let service: CreateMedicalHistory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateMedicalHistory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
