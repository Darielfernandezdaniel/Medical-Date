import { TestBed } from '@angular/core/testing';

import { ShowSectionInfo } from './show-section-info';

describe('ShowSectionInfo', () => {
  let service: ShowSectionInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowSectionInfo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
