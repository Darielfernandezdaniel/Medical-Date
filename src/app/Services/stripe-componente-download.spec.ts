import { TestBed } from '@angular/core/testing';

import { StripeComponenteDownload } from './stripe-componente-download';

describe('StripeComponenteDownload', () => {
  let service: StripeComponenteDownload;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeComponenteDownload);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
