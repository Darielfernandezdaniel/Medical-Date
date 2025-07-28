import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PRUEBAS_DATA } from './Test-info-JSONS';
import { TestInfo } from '../Interfaces/Insurances';

@Injectable({
  providedIn: 'root'
})
export class TestInfoService {
  private data = PRUEBAS_DATA;

  getInfoByAlt(alt: string): Observable<TestInfo | undefined> {
    return of(this.data[alt]);
  }
}