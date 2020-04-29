import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class RegistroService {
  public url = '/usuarios/registro';
  constructor(private http: HttpClient) {}

  /**
   * Registra a un usuario
   * @method POST
   * @param usuario datos del usuario: nick, nombre, apellido1, apellido2, password, email
   */
  registrar(usuario: any): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(usuario), httpOptions);
  }

  /**
   * Registra a un usuario por invitacion. Si el token es correcto, ademas lo agrega al proyecto especificado
   * @method POST
   * @param usuario datos del usuario: token, nick, nombre, apellido1, apellido2, password, email
   */
  registrarPorInvitacion(usuario: any): Observable<any> {
    return this.http.post<any>(this.url + '/invitar', JSON.stringify(usuario), httpOptions);
  }
}
