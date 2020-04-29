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
export class CriteriosService {
  public url = '/criterios';
  constructor(private http: HttpClient) {}

  /**
   * Crea un criterio
   * @method POST
   * @param criterio contiene los datos del criterio: nombre, idpbi, done
   */
  crearCriterio(criterio: any): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(criterio), httpOptions);
  }

  /**
   * Actualiza un criterio
   * @method PUT
   * @param criterio contiene los nuevos datos del criterio: idcriterio, nombre, done
   */
  actualizarCriterio(criterio: any): Observable<any> {
    return this.http.put<any>(this.url + '/' + criterio.idcriterio, JSON.stringify(criterio), httpOptions);
  }

  /**
   * Borra un criterio
   * @method DELETE
   * @param {number} idcriterio id del criterio a borrar
   */
  borrarCriterio(idcriterio: number): Observable<any> {
    return this.http.delete<any>(this.url + '/' + idcriterio, httpOptions);
  }
}
