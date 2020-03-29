import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '@app/models/usuarios';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class UsuariosService {
  private url = '/usuarios';
  constructor(private http: HttpClient) {}

  getUsuario(idusuario: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idusuario, httpOptions);
  }

  getUsuariosProyectos(idusuario: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idusuario + '/proyectos', httpOptions);
  }

  getUsuarioProyectoPermisos(idusuario: number, idproyecto: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idusuario + '/proyectos/' + idproyecto + '/permisos', httpOptions);
  }

  actualizarUsuario(usuario: Usuario): Observable<any> {
    console.log(usuario);
    return this.http.put<any>(this.url + '/' + usuario.idusuario + '/actualizar', JSON.stringify(usuario), httpOptions);
  }

  /* {
    "ordenar": 0,
    "editarPBI": 1,
    "estimarTam": 1,
    "mantenerUsuarios": 0,
    "archivarProyecto": 0,
    "setDone": 1,
    "proyecciones": 0
} */
}
