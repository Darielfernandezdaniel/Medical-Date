import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImgFromS3 {
  private apiUrl = 'https://tmrafzrth23c3kppfa7osjvq2a0ytfpe.lambda-url.eu-central-1.on.aws';

  constructor( private http: HttpClient){}

  getImages(page: number, limit: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get(this.apiUrl, { params });
  }
}
