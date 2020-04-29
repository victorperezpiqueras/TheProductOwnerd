import { TestBed } from '@angular/core/testing';
import { Proyecto } from './proyectos';
import { Usuario } from './usuarios';

describe('Permiso', () => {
  let model: Proyecto;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Proyecto]
    });
  });

  it('should create', () => {
    let usuarios: Usuario[] = [
      { idusuario: 1, nombre: '1', apellido1: '1', apellido2: '1', nick: '1', email: '1', password: '1' }
    ];
    model = new Proyecto(1, '1', '1', '1', 1, usuarios);
    expect(model.idproyecto).toBe(1);
    expect(model.nombre).toBe('1');
    expect(model.descripcion).toBe('1');
    expect(model.vision).toBe('1');
    expect(model.sprintActual).toBe(1);
    expect(model.usuarios).toBe(usuarios);
  });
});
