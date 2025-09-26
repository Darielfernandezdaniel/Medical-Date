import { TestBed } from '@angular/core/testing';
import { TestInfo } from './test-info';



describe('TestInfo', () => {
  let service: TestInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestInfo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
