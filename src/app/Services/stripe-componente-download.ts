import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeComponenteDownload {
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    // Aquí tu clave publicable de Stripe
    this.stripePromise = loadStripe('pk_test_51S5a03E25S4ze44aJiefyOiJtLIfiEm57KodPPtNgK8B1pgpDGOYNCqNWNc3tT765Y1MtkCHi9zXo1l21Qiveonx00MdDc2KQR');
  }

  getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }
}
