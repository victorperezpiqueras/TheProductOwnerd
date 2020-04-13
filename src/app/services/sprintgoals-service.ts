import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SprintGoal } from '@app/models/sprintGoals';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class SprintGoalsService {
  private url = '/sprintgoals';
  constructor(private http: HttpClient) {}

  crearSprintGoal(sprintgoal: SprintGoal): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(sprintgoal), httpOptions);
  }
  actualizarSprintGoal(sprintgoal: SprintGoal): Observable<any> {
    return this.http.put<any>(this.url, JSON.stringify(sprintgoal), httpOptions);
  }
}
