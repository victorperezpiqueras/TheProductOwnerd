import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuariosService } from './usuarios.service';
import { Usuario } from '@app/models/usuarios';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuariosService]
    });
    service = TestBed.get(UsuariosService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a user', () => {
    const id: number = 1;
    service.getUsuario(id).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id, 'get');
    expect(req.request.method).toBe('GET');
  });

  it('should get a user projects', () => {
    const id: number = 1;
    service.getUsuarioProyectos(id).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/proyectos', 'get');
    expect(req.request.method).toBe('GET');
  });

  it('should get a user projects permissions', () => {
    const id: number = 1;
    const idproyecto: number = 1;
    service.getUsuarioProyectoPermisos(id, idproyecto).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/proyectos/' + idproyecto + '/permisos', 'get');
    expect(req.request.method).toBe('GET');
  });

  it('should get a user favourite projects', () => {
    const id: number = 1;
    service.getUsuarioProyectosFavoritos(id).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/proyectosfavoritos', 'get');
    expect(req.request.method).toBe('GET');
  });

  it('should add a project to favourites', () => {
    const id: number = 1;
    const idproyecto: number = 1;
    service.agregarUsuarioProyectosFavoritos(id, idproyecto).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/proyectosfavoritos', 'post');
    expect(req.request.method).toBe('POST');
  });

  it('should remove a project from favourites', () => {
    const id: number = 1;
    const idproyecto: number = 1;
    service.eliminarUsuarioProyectosFavoritos(id, idproyecto).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/proyectosfavoritos/' + idproyecto, 'delete');
    expect(req.request.method).toBe('DELETE');
  });

  it('should update a user', () => {
    const data: Usuario = {
      idusuario: 1,
      nick: 'a',
      nombre: 'a',
      apellido1: 'a',
      apellido2: 'a',
      password: 'a',
      email: 'a'
    };
    service.actualizarUsuario(data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + data.idusuario + '/actualizar', 'put');
    expect(req.request.method).toBe('PUT');
  });

  it('should update a user password', () => {
    const data: Usuario = {
      idusuario: 1,
      nick: 'a',
      nombre: 'a',
      apellido1: 'a',
      apellido2: 'a',
      password: 'a',
      email: 'a'
    };
    service.actualizarUsuarioPassword(data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + data.idusuario + '/actualizarpassword', 'put');
    expect(req.request.method).toBe('PUT');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
