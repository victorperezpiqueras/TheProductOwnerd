import { Importancia } from './../models/importancias';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class ImportanciasService {
  public url = '/importancias';
  constructor(private http: HttpClient) {}

  /**
   * Crea una importancia
   * @method POST
   * @param importancia contiene los datos de la importancia: valor, idpbi, idrol
   */
  crearImportancia(importancia: Importancia): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(importancia), httpOptions);
  }

  /**
   * Edita un pbi
   * @method PUT
   * @param importancia contiene los datos de la importancia: valor, idpbi, idrol
   */
  editarImportancia(importancia: Importancia): Observable<any> {
    return this.http.put<any>(this.url + '/' + importancia.idimportancia, JSON.stringify(importancia), httpOptions);
  }
}
