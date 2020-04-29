import { TestBed } from '@angular/core/testing';
import { Sprint } from './sprints';

describe('Permiso', () => {
  let model: Sprint;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Sprint]
    });
  });

  it('should create', () => {
    model = new Sprint('1', 1, 1, 1, 1, '1');
    expect(model.sprint).toBe('1');
    expect(model.sprintNumber).toBe(1);
    expect(model.restante).toBe(1);
    expect(model.quemado).toBe(1);
    expect(model.quemadoRelativo).toBe(1);
    expect(model.porcentaje).toBe('1');
  });
});
