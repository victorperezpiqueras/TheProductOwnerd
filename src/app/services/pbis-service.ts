import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto } from '@app/models/proyectos';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class PbisService {
  public proyecto: Proyecto;
  private url = '/pbis';
  constructor(private http: HttpClient) {}

  crearPbi(data: any): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(data), httpOptions);
  }
}
