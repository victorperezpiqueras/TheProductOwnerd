import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class RegistroService {
  private url = '/usuarios/registro';
  constructor(private http: HttpClient) {}

  registrar(credenciales: any): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(credenciales), httpOptions);
  }

  registrarPorInvitacion(credenciales: any): Observable<any> {
    return this.http.post<any>(this.url + '/invitar', JSON.stringify(credenciales), httpOptions);
  }
}
