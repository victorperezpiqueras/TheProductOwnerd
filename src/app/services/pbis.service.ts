import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto } from '@app/models/proyectos';
import { Pbi } from '@app/models/pbis';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Disposition': 'attachment; filename="filename.png"; filename*="filename.png"'
  })
};

@Injectable()
export class PbisService {
  private url = '/pbis';
  constructor(private http: HttpClient) {}

  /**
   * Crea un pbi
   * @method POST
   * @param pbi contiene los datos del pbi: titulo, descripcion, done, label, estimacion, valor, idproyecto, prioridad, sprintCreacion
   */
  crearPbi(pbi: Pbi): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(pbi), httpOptions);
  }

  /**
   * Edita un pbi
   * @method PUT
   * @param pbi contiene los datos del pbi: idpbi, titulo, descripcion, done, label, estimacion, valor, prioridad, sprintCreacion
   */
  editarPbi(pbi: Pbi): Observable<any> {
    return this.http.put<any>(this.url + '/' + pbi.idpbi, JSON.stringify(pbi), httpOptions);
  }

  /**
   * Edita las prioridades de un pbi
   * @method PUT
   * @param pbis contiene los datos de los pbis a editar: pbis[]=> prioridad, idpbi
   */
  editarPrioridadesPbis(pbis: Pbi[]): Observable<any> {
    return this.http.put<any>(this.url, JSON.stringify(pbis), httpOptions);
  }

  /**
   * Obtiene los comentarios de un pbi
   * @method GET
   * @param idpbi id del pbi
   * @returns [ {idcomentario, comentario, fecha, idpbi, idusuario, nick} ]
   */
  obtenerComentarios(idpbi: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idpbi + '/comentarios', httpOptions);
  }

  /**
   * Obtiene los archivos de un pbi
   * @method GET
   * @param idpbi id del pbi
   * @returns [ {idarchivo, nombre, src, idpbi, idusuario, nombreUsuario} ]
   */
  obtenerArchivos(idpbi: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idpbi + '/archivos', httpOptions);
  }

  /**
   * Obtiene los criterios de un pbi
   * @method GET
   * @param idpbi id del pbi
   * @returns [ {idcriterio, nombre, done, idpbi} ]
   */
  obtenerCriterios(idpbi: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idpbi + '/criterios', httpOptions);
  }

  /**
   * Obtiene las dependencias de un pbi
   * @method GET
   * @param idpbi id del pbi
   * @returns [ {iddependencia, idpbi, idpbi2} ]
   */
  obtenerDependencias(idpbi: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + idpbi + '/dependencias', httpOptions);
  }
}
