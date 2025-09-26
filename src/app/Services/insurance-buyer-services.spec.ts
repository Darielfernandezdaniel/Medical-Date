import { TestBed } from '@angular/core/testing';

import { InsuranceBuyerServices } from './insurance-buyer-services';

describe('InsuranceBuyerServices', () => {
  let service: InsuranceBuyerServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuranceBuyerServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
