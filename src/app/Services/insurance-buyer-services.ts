import { Injectable } from '@angular/core';
import { BrowserStorageServices } from './browser-storage-services';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';


@Injectable()
export class InsuranceBuyerServices {
  private apiUrl = 'https://6x9ug115v5.execute-api.eu-central-1.amazonaws.com/default/InsurancePayment';

  constructor(private storage: BrowserStorageServices, private route:Router, private http: HttpClient,){

  }
  
  insuranceBuyerServices(insuranceBuying: string) {
    const email = this.storage.getLocalItem("email") || this.storage.getSessionItem("email");
    
    if (!email) {
      this.route.navigate(["/register/join"]);
    }
  
    const body = { email, insuranceBuying };
    const headers = { 'Content-Type': 'application/json' };
  
    // Retornamos el observable sin suscribirlo
    return this.http.post<{ sessionId: string, asegurado?: boolean }>(this.apiUrl, body, { headers });
  }
}
