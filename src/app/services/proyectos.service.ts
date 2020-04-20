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

  /**
   * Obtiene todos los proyectos
   */
  getProyectos(credenciales: any): Observable<any> {
    console.log('login', JSON.stringify(credenciales));
    return this.http.post<any>(this.url, JSON.stringify(credenciales), httpOptions);
  }

  /**
   * Obtiene un proyecto dado su id
   * @method GET
   * @param {number} idproyecto id del proyecto
   * @returns (idproyecto, nombre, descripcion, sprintActual, vision)
   */
  getProyecto(idproyecto: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idproyecto, httpOptions);
  }

  /**
   * Obtiene los usuarios de un proyecto
   * @method GET
   * @param {number} idproyecto id del proyecto
   * @returns [ {idusuario, nombre, email} ]
   */
  getProyectosUsuarios(idproyecto: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idproyecto + '/usuarios', httpOptions);
  }

  /**
   * Obtiene los usuarios y roles de un proyecto
   * @method GET
   * @param {number} idproyecto id del proyecto
   * @returns [ {idusuario, nick, email, rol} ]
   */
  getProyectoUsuariosRoles(idproyecto: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idproyecto + '/usuarios/roles', httpOptions);
  }

  /**
   * Obtiene todos los usuarios y roles
   * @method GET
   */
  getProyectosUsuariosRoles(): Observable<any> {
    return this.http.get<any>(this.url + '/usuarios/roles', httpOptions);
  }

  /**
   * Crea un proyecto y asigna el rol productOwner al usuario
   * @method POST
   * @param proyecto contiene los datos del proyecto: nombre, descripcion; y del usuario: idusuario
   */
  crearProyecto(proyecto: any): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(proyecto), httpOptions);
  }

  /**
   * Actualiza los datos de un proyecto
   * @method PUT
   * @param {number} idproyecto id del proyecto
   * @param proyecto contiene los datos del proyecto: nombre, descripcion, vision, sprintActual
   */
  actualizarProyecto(idproyecto: number, proyecto: any): Observable<any> {
    return this.http.put<any>(this.url + '/' + idproyecto, JSON.stringify(proyecto), httpOptions);
  }

  /**
   * Obtiene los pbis de un proyecto
   * @method GET
   * @param {number} idproyecto id del proyecto
   * @returns [ {idpbi, titulo, descripcion, done, label, estimacion, idproyecto, prioridad, valor, sprint, sprintCreacion} ]
   */
  getProyectosPBI(idproyecto: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idproyecto + '/pbis', httpOptions);
  }

  /**
   * Invita un usuario al proyecto. Si existe lo agrega, si no, genera una in
   * @method POST
   * @param {number} idproyecto id del proyecto
   * @param data datos de la invitacion: email, rol, nombreProyecto, invitadoPor
   */
  invitarUsuario(idproyecto: number, email: any): Observable<any> {
    return this.http.post<any>(this.url + '/' + idproyecto + '/invitar', JSON.stringify(email), httpOptions);
  }

  /**
   * Elimina un usuario del proyecto
   * @method DELETE
   * @param {number} idproyecto id del proyecto
   * @param {number} idusuario id del usuario
   */
  eliminarUsuario(idproyecto: number, idusuario: number): Observable<any> {
    return this.http.delete<any>(this.url + '/' + idproyecto + '/eliminarUsuario' + '/' + idusuario, httpOptions);
  }

  /**
   * Obtiene los sprintgoals de un proyecto
   * @method GET
   * @param {number} idproyecto id del proyecto
   * @returns [ {idproyecto, goal, sprintNumber} ]
   */
  getProyectoSprintGoals(idproyecto: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idproyecto + '/sprintgoals', httpOptions);
  }
}
