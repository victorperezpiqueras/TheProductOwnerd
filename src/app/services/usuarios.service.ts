import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '@app/models/usuarios';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class UsuariosService {
  public url = '/usuarios';
  constructor(private http: HttpClient) {}

  /**
   * Obtiene un usuario por el id
   * @method GET
   * @param id id del usuario
   * @returns (idusuario, nombre, password, email, nick, apellido1, apellido2)
   */
  getUsuario(idusuario: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idusuario, httpOptions);
  }

  /**
   * Obtiene los proyectos de un usuario
   * @method GET
   * @param {number} idusuario id del usuario
   * @returns [ {idproyecto, nombre, descripcion, sprintActual, deadline, vision} ]
   */
  getUsuarioProyectos(idusuario: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idusuario + '/proyectos', httpOptions);
  }

  /**
   * Obtiene los permisos de un usuario para un proyecto
   * @method GET
   * @param {number} idusuario id del usuario
   * @param {number} idproyecto id del proyecto
   */
  getUsuarioProyectoPermisos(idusuario: number, idproyecto: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idusuario + '/proyectos/' + idproyecto + '/permisos', httpOptions);
  }

  /**
   * Obtiene los proyectos favoritos de un usuario
   * @method GET
   * @param {number} idusuario id del usuario
   * @returns [ {idproyecto, idusuario, nombre} ]
   */
  getUsuarioProyectosFavoritos(idusuario: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idusuario + '/proyectosfavoritos', httpOptions);
  }

  /**
   * Agrega un proyecto del usuario a sus favoritos
   * @method POST
   * @param {number} idusuario id del usuario
   * @param idproyecto id del proyecto
   */
  agregarUsuarioProyectosFavoritos(idusuario: number, idproyecto: number): Observable<any> {
    return this.http.post<any>(
      this.url + '/' + idusuario + '/proyectosfavoritos',
      JSON.stringify({ idproyecto: idproyecto }),
      httpOptions
    );
  }

  /**
   * Elimina un proyecto del usuario de sus favoritos
   * @method DELETE
   * @param {number} idusuario id del usuario
   * @param {number} idproyecto id del proyecto
   */
  eliminarUsuarioProyectosFavoritos(idusuario: number, idproyecto: number): Observable<any> {
    return this.http.delete<any>(this.url + '/' + idusuario + '/proyectosfavoritos/' + idproyecto, httpOptions);
  }

  /**
   * Actualiza los datos de un usuario
   * @method PUT
   * @param {number} idusuario id del usuario
   * @param data datos del usuario: nick, nombre, apellido1, apellido2, email
   */
  actualizarUsuario(usuario: Usuario): Observable<any> {
    console.log(usuario);
    return this.http.put<any>(this.url + '/' + usuario.idusuario + '/actualizar', JSON.stringify(usuario), httpOptions);
  }

  /**
   * Actualiza la password de un usuario
   * @method PUT
   * @param {number} idusuario id del usuario
   * @param data datos del usuario: password, newPassword
   */
  actualizarUsuarioPassword(data: any): Observable<any> {
    return this.http.put<any>(
      this.url + '/' + data.idusuario + '/actualizarpassword',
      JSON.stringify(data),
      httpOptions
    );
  }
}
