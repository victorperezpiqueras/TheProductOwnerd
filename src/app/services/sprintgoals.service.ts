import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SprintGoal } from '@app/models/sprintGoals';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class SprintGoalsService {
  public url = '/sprintgoals';
  constructor(private http: HttpClient) {}

  /**
   * Crea un sprintgoal
   * @method POST
   * @param sprintGoal datos del sprintgoal: idproyecto, goal, sprintNumber
   */
  crearSprintGoal(sprintgoal: SprintGoal): Observable<any> {
    return this.http.post<any>(this.url, JSON.stringify(sprintgoal), httpOptions);
  }

  /**
   * Actualiza el goal de un sprintgoal
   * @method PUT
   * @param sprintGoal datos del sprintgoal: idproyecto, goal, sprintNumber
   */
  actualizarSprintGoal(sprintgoal: SprintGoal): Observable<any> {
    return this.http.put<any>(this.url, JSON.stringify(sprintgoal), httpOptions);
  }
}
