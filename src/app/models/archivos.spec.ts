import { TestBed } from '@angular/core/testing';
import { Archivo } from './archivos';

describe('Archivo', () => {
  let model: Archivo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Archivo]
    });
  });

  it('should create', () => {
    model = new Archivo(1, 'a', 'a', 1, 1, 'a');
    expect(model.idpbi).toBe(1);
    expect(model.idusuario).toBe(1);
    expect(model.nombre).toBe('a');
    expect(model.nombreUsuario).toBe('a');
    expect(model.src).toBe('a');
    expect(model.idarchivo).toBe(1);
  });
});
