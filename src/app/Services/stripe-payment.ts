import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripePayment {

  private apiGatewayUrl = 'https://TU_API_GATEWAY_ENDPOINT'; // Cambiar por tu endpoint real

  constructor(private http: HttpClient) {}

  /**
   * Pago de cita médica
   */
  payCita(metadata?: any): Observable<any> {
    const body = {
      tipo: 'cita',
      ...metadata // Puedes pasar datos adicionales opcionales
    };
    return this.callStripeBackend(body);
  }

  /**
   * Pago de seguro
   */
  paySeguro(nombreSeguro: string, metadata?: any): Observable<any> {
    const body = {
      tipo: 'seguro',
      nombre_seguro: nombreSeguro,
      ...metadata
    };
    return this.callStripeBackend(body);
  }

  /**
   * Función interna para llamar a API Gateway
   */
  private callStripeBackend(body: any): Observable<any> {
    return this.http.post(this.apiGatewayUrl, body);
  }
}
