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
export class InvitacionesService {
  public url = '/invitaciones';
  constructor(private http: HttpClient) {}

  /**
   * Obtiene una invitacion dado un token
   * @method GET
   * @param {string} token token asignado a la invitacion
   */
  obtenerInvitacion(token: string): Observable<any> {
    return this.http.get<any>(this.url + '/' + token, httpOptions);
  }
}
