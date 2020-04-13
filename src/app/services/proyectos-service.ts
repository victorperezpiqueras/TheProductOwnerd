import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto } from '@app/models/proyectos';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class ProyectosService {
  public proyecto: Proyecto;
  private url = '/proyectos';
  constructor(private http: HttpClient) {}

  getProyectos(credenciales: any): Observable<any> {
    console.log('login', JSON.stringify(credenciales));
    return this.http.post<any>(this.url, JSON.stringify(credenciales), httpOptions);
  }
  getProyecto(idproyecto: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idproyecto, httpOptions);
  }
  getProyectosUsuarios(idproyecto: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idproyecto + '/usuarios', httpOptions);
  }
  getProyectoUsuariosRoles(idproyecto: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idproyecto + '/usuarios/roles', httpOptions);
  }
  getProyectosUsuariosRoles(): Observable<any> {
    return this.http.get<any>(this.url + '/usuarios/roles', httpOptions);
  }
  crearProyecto(data: any): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(data), httpOptions);
  }
  actualizarProyecto(idproyecto: number, data: any): Observable<any> {
    return this.http.put<any>(this.url + '/' + idproyecto, JSON.stringify(data), httpOptions);
  }
  getProyectosPBI(idproyecto: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idproyecto + '/pbis', httpOptions);
  }
  invitarUsuario(idproyecto: number, email: any): Observable<any> {
    return this.http.post<any>(this.url + '/' + idproyecto + '/invitar', JSON.stringify(email), httpOptions);
  }
  eliminarUsuario(idproyecto: number, idusuario: number): Observable<any> {
    return this.http.delete<any>(this.url + '/' + idproyecto + '/eliminarUsuario' + '/' + idusuario, httpOptions);
  }
  getProyectoSprintGoals(idproyecto: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idproyecto + '/sprintgoals', httpOptions);
  }
}
