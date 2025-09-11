import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeInterfaces } from './stripe-interfaces';

describe('StripeInterfaces', () => {
  let component: StripeInterfaces;
  let fixture: ComponentFixture<StripeInterfaces>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripeInterfaces]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripeInterfaces);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
