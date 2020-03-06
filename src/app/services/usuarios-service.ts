import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class UsuariosService {
  private url = '/usuarios';
  constructor(private http: HttpClient) {}

  getUsuariosProyectos(idusuario: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idusuario + '/proyectos', httpOptions);
  }

  getUsuarioProyectoPermisos(idusuario: number, idproyecto: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idusuario + '/proyectos/' + idproyecto + '/permisos', httpOptions);
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
