import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WriteEmailInRDS {

    private apiUrl = 'https://smbpwy599a.execute-api.eu-central-1.amazonaws.com/Develop/writeEmailInRDS';
  
    constructor(private http: HttpClient) {}
  
    writeEmailInRDS(email: string): Observable<any> {
      // Enviamos el email como JSON en el body
      return this.http.post<any>(this.apiUrl, { email });
  }
}
