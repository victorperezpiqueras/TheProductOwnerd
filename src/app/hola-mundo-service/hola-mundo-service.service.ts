import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HolaMundoService {
  private url = '/holamundo/';
  constructor(private http: HttpClient) {}

  getHolaMundo(): Observable<any> {
    return this.http.get<any>(this.url);
  }
}
