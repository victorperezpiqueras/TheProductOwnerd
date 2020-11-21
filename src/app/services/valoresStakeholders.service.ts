import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ValorStakeholder } from '@app/models/valoresStakeholders';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class ValoresStakeholdersService {
  public url = '/valores';
  constructor(private http: HttpClient) {}

  /**
   * Crea una valor
   * @method POST
   * @param valor contiene los datos del valor: valor, idpbi, idrol
   */
  crearValor(valor: ValorStakeholder): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(valor), httpOptions);
  }

  /**
   * Edita un pbi
   * @method PUT
   * @param valor contiene los datos del valor: valor, idpbi, idrol
   */
  editarValor(valor: ValorStakeholder): Observable<any> {
    return this.http.put<any>(this.url + '/' + valor.idvalor, JSON.stringify(valor), httpOptions);
  }
}
