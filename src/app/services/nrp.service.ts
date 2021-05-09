import { async } from '@angular/core/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pbi } from '@app/models/pbis';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable({
  providedIn: 'root'
})
export class NrpService {
  public url = environment.awsUrl;
  constructor(private http: HttpClient) {}

  /**
   * Calcula el nrp de un proyecto
   */
  calculateNrp(data: any): Observable<any> {
    return this.http.post<any>(this.url + '/calculateGeneticNDS', JSON.stringify(data), httpOptions); //calculateNSGAII
  }
}
