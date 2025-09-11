import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { BrowserStorageServices } from './browser-storage-services';

@Injectable({
  providedIn: 'root'
})
export class StripeComponenteDownload {
  stripePromise = loadStripe('pk_test_51S5a03E25S4ze44aJiefyOiJtLIfiEm57KodPPtNgK8B1pgpDGOYNCqNWNc3tT765Y1MtkCHi9zXo1l21Qiveonx00MdDc2KQR');

  constructor(private http: HttpClient, private storage:BrowserStorageServices) {}

  ngOnInit(){}

  async checkout(titulo:string){
    const stripe = await this.stripePromise;
    const email = this.storage.getLocalItem("email") || this.storage.getSessionItem("email")

    this.http.post<{sessionId: string, asegurado?: boolean}>('/api/create-checkout-session', {
      items: titulo,
      email: email
    })     .subscribe(async (response) => {
      // Redirecciona al checkout de Stripe usando la sessionId
      const result = await stripe?.redirectToCheckout({
        sessionId: response.sessionId
      });

      if (result && result.error) {
        // Maneja el error
        console.error(result.error.message);
      }
    });
  }
}