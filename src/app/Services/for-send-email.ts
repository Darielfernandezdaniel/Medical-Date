import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ForSendEmail {

  // ✅ Quitar espacio al final de la URL
  private apiUrl = "https://of55qg7rdl.execute-api.eu-central-1.amazonaws.com/default/LambdaForTwilio";
 
  constructor(private http: HttpClient) {}

  async sendTicket(data: { email: string; nombreCompleto: string; telefono?: string }) {
    const body = {
      email: data.email,
      nombreCompleto: data.nombreCompleto,
      telefono: data.telefono
    };

    try {
      console.log("📩 Enviando a Lambda:", body);
      const response = await firstValueFrom(
        this.http.post(this.apiUrl, body, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        })
      );
      console.log("✅ Respuesta Lambda:", response);
      return response;
    } catch (err) {
      console.error("❌ Error enviando ticket a Lambda:", err);
      throw err;
    }
  }
}