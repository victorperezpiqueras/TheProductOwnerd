import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto } from '@app/models/proyectos';
import { Pbi } from '@app/models/pbis';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class PbisService {
  public proyecto: Proyecto;
  private url = '/pbis';
  constructor(private http: HttpClient) {}

  crearPbi(data: Pbi): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(data), httpOptions);
  }
  editarPbi(data: Pbi): Observable<any> {
    return this.http.put<any>(this.url + '/' + data.idpbi, JSON.stringify(data), httpOptions);
  }
}
