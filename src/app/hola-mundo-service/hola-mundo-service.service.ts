import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HolaMundoService {
  constructor(private http: HttpClient) {}

  getHolaMundo(): Observable<any> {
    return this.http.get<any>('http://localhost:5000/api/holamundo/');
  }
}
