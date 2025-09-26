import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStatusConfirmation } from './payment-status-confirmation';

describe('PaymentStatusConfirmation', () => {
  let component: PaymentStatusConfirmation;
  let fixture: ComponentFixture<PaymentStatusConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentStatusConfirmation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentStatusConfirmation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
