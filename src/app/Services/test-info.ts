import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PersonalData } from '../Interfaces/Insurances';

@Injectable({
  providedIn: 'root'
})
export class TestInfoService {
  private apiUrl = "https://8imi4w4zu9.execute-api.eu-central-1.amazonaws.com";
  constructor(private http: HttpClient) {}

  sendPatientData(data: PersonalData ) {
    return this.http.post('TU_API_GATEWAY_URL', JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
}