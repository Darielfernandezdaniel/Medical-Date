import { TestBed } from '@angular/core/testing';

import { ForSendEmail } from './for-send-email';

describe('ForSendEmail', () => {
  let service: ForSendEmail;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForSendEmail);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
