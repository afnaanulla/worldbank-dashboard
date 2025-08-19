import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DataService {
  private base = environment.apiBase;
  constructor(private http: HttpClient) {}

  indicators(params: {country:string; codes:string[]; start:number; end:number}) {
    let p = new HttpParams()
      .set('country', params.country)
      .set('codes', params.codes.join(','))
      .set('start', String(params.start))
      .set('end', String(params.end));
    return this.http.get<any>(`${this.base}/indicators/`, { params: p, withCredentials: true });
  }
}
