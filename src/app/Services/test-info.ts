import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PersonalData } from '../Interfaces/Insurances';
import { Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class TestInfoService {
  private apiUrl = "https://8imi4w4zu9.execute-api.eu-central-1.amazonaws.com/dev/PatientData";
  constructor(private http: HttpClient) {}
  private patientDataResult$ = new Subject<any>();

  sendPatientData(data: PersonalData) {
    return this.http.post(this.apiUrl, data, {
      headers: { 'Content-Type': 'application/json' },
    }).pipe(
      tap(result => this.patientDataResult$.next(result))
    );
  }
  
  // Para suscribirse
  getPatientDataResult$() {
    return this.patientDataResult$.asObservable();
  }
}