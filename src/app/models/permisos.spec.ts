import { TestBed } from '@angular/core/testing';
import { Permisos } from './permisos';

describe('Permiso', () => {
  let model: Permisos;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Permisos]
    });
  });

  it('should create', () => {
    model = new Permisos(1, 1, 1, 1, 1, 1, 1, 1, 1);
    expect(model.ordenar).toBe(1);
    expect(model.editarPBI).toBe(1);
    expect(model.estimarTam).toBe(1);
    expect(model.estimarValor).toBe(1);
    expect(model.mantenerUsuarios).toBe(1);
    expect(model.archivarProyecto).toBe(1);
    expect(model.setDone).toBe(1);
    expect(model.proyecciones).toBe(1);
    expect(model.sprintGoals).toBe(1);
  });
});
