import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto } from '@app/models/proyectos';
import { Pbi } from '@app/models/pbis';
import { Comentario } from '@app/models/comentarios';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class DependenciasService {
  private url = '/dependencias';
  constructor(private http: HttpClient) {}

  crearDependencia(dependencia: any): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(dependencia), httpOptions);
  }
  borrarDependencia(idpbi: number, idpbi2: number): Observable<any> {
    return this.http.delete<any>(this.url + '/' + idpbi + '/' + idpbi2, httpOptions);
  }
}
