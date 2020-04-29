import { TestBed } from '@angular/core/testing';
import { SprintGoal } from './sprintGoals';

describe('Permiso', () => {
  let model: SprintGoal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SprintGoal]
    });
  });

  it('should create', () => {
    model = new SprintGoal(1, '1', 1);
    expect(model.idproyecto).toBe(1);
    expect(model.goal).toBe('1');
    expect(model.sprintNumber).toBe(1);
  });
});
