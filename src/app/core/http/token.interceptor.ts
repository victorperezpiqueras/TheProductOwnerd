import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { CredentialsService } from '../authentication/credentials.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(private credentialsService: CredentialsService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let tokenizedReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token}`
      }
    });
    return next.handle(tokenizedReq);
  }

  get token(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.token : null;
  }

  /* get token() {
        return this.credentialsService.getCredentials();
    } */
}
