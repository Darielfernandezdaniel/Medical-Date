import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CheckingDataPatient {  
  constructor(private http: HttpClient) {}

  private url = "https://460rifwmm2.execute-api.eu-central-1.amazonaws.com/Develop/checkingDataPatient"

  confirmateDataPatient(email: string): Observable<{exists: boolean}> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<{exists: boolean}>(
      this.url,
      { email },
      { headers }
    );
  }
}
