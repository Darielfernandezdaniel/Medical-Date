import { TestBed } from '@angular/core/testing';

import { BrowserStorageServices } from './browser-storage-services';

describe('BrowserStorageServices', () => {
  let service: BrowserStorageServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserStorageServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
