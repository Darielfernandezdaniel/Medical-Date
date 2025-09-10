import { TestBed } from '@angular/core/testing';

import { StripePayment } from './stripe-payment';

describe('StripePayment', () => {
  let service: StripePayment;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripePayment);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
