import { TestBed } from '@angular/core/testing';

import { ImgFromS3 } from './img-from-s3';

describe('ImgFromS3', () => {
  let service: ImgFromS3;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImgFromS3);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
