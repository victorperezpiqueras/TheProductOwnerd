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
export class ArchivosService {
  private url = '/archivos';
  constructor(private http: HttpClient) {}

  /**
   * Crea un archivo
   * @method POST
   * @param archivo contiene los datos del archivo: nombre, src, idpbi, idusuario
   */
  crearArchivo(archivo: any): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(archivo), httpOptions);
  }

  /**
   * Borra un archivo
   * @method DELETE
   * @param id id del archivo
   */
  borrarArchivo(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/' + id, httpOptions);
  }
}
