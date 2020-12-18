import { TestBed } from '@angular/core/testing';
import { Pbi } from './pbis';

describe('Pbi', () => {
  let model: Pbi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Pbi]
    });
  });

  it('should create', () => {
    model = new Pbi(1, '1', '1', 1, '1', 1, 1, 1, 1, 1, 1, 1);
    expect(model.idpbi).toBe(1);
    expect(model.titulo).toBe('1');
    expect(model.descripcion).toBe('1');
    expect(model.done).toBe(1);
    expect(model.label).toBe('1');
    expect(model.estimacion).toBe(1);
    expect(model.valor).toBe(1);
    expect(model.prioridad).toBe(1);
    expect(model.sprint).toBe(1);
    expect(model.idproyecto).toBe(1);
    expect(model.sprintCreacion).toBe(1);
    expect(model.idrelease).toBe(1);
  });
});
