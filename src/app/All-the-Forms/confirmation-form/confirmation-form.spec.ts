import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationForm } from './confirmation-form';

describe('ConfirmationForm', () => {
  let component: ConfirmationForm;
  let fixture: ComponentFixture<ConfirmationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
