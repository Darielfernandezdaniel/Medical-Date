import { TestBed } from '@angular/core/testing';
import { RestorePassword } from './RestorePassword-password';



describe('ResetPassword', () => {
  let service: RestorePassword;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestorePassword);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
