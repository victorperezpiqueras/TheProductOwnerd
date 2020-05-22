import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class LoginService {
  public url = '/usuarios/login';
  constructor(private http: HttpClient) {}

  /**
   * Loguea a un usuario y le devuelve un token con sus credenciales
   * @method POST
   * @param usuario datos del usuario: email, password
   * @returns credentials: { nick, idusuario, token }
   */
  login(credenciales: any): Observable<any> {
    // console.log('login', JSON.stringify(credenciales));
    return this.http.post<any>(this.url, JSON.stringify(credenciales), httpOptions);
  }
}
