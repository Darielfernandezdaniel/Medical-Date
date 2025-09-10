import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MedicalTestInfo } from '../Interfaces/Insurances';

@Injectable({
  providedIn: 'root'
})
export class GetMedicatlTestIngo {
  private apiUrl = 'https://zzoqwr6cxjrbku4ccakqmbxwai0yqywc.lambda-url.eu-central-1.on.aws/'; // reemplaza con tu URL de Lambda

  constructor(private http: HttpClient) {}

  // Función para buscar información por término (id, título o descripción)
  getInfoById(query: string): Observable<MedicalTestInfo[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<MedicalTestInfo []>(this.apiUrl, {params });
  }
}
