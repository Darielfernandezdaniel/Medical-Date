import { TestBed } from '@angular/core/testing';

import { WriteEmailInRDS } from './write-email-in-rds';

describe('WriteEmailInRDS', () => {
  let service: WriteEmailInRDS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WriteEmailInRDS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
