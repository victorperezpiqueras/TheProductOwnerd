import { Release } from './../models/releases';
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
export class ReleasesService {
  public url = '/releases';
  constructor(private http: HttpClient) {}

  /**
   * Crea una criterio
   * @method POST
   * @param release contiene los datos de la release: version, descripcion, sprint, idproyecto
   */
  crearRelease(release: any): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(release), httpOptions);
  }

  /**
   * Actualiza una release
   * @method PUT
   * @param release contiene los datos de la release: version, descripcion, sprint, idproyecto
   */
  actualizarRelease(release: Release): Observable<any> {
    return this.http.put<any>(this.url + '/' + release.idrelease, JSON.stringify(release), httpOptions);
  }

  /**
   * Borra una release
   * @method DELETE
   * @param {number} idrelease id de la release a borrar
   */
  borrarRelease(idrelease: number): Observable<any> {
    return this.http.delete<any>(this.url + '/' + idrelease, httpOptions);
  }
}
