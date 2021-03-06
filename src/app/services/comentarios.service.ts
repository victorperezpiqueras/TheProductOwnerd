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
export class ComentariosService {
  public url = '/comentarios';
  constructor(private http: HttpClient) {}

  /**
   * Crea un comentario
   * @method POST
   * @param comentario contiene los datos del comentario: comentario, idpbi, idusuario, fecha
   */
  crearComentario(data: any): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(data), httpOptions);
  }
}
