import { TestBed } from '@angular/core/testing';

import { GetMedicatlTestIngo } from './get-medicatl-test-ingo';

describe('GetMedicatlTestIngo', () => {
  let service: GetMedicatlTestIngo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetMedicatlTestIngo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
