import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProyectosService } from './proyectos.service';

describe('ProyectosService', () => {
  let service: ProyectosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProyectosService]
    });
    service = TestBed.get(ProyectosService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all proyectos', () => {
    service.getProyectos().subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url, 'get');
    expect(req.request.method).toBe('GET');
  });

  it('should get proyecto usuarios', () => {
    const id: number = 1;
    service.getProyectoUsuarios(id).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/usuarios', 'get');
    expect(req.request.method).toBe('GET');
  });

  it('should get proyecto usuarios roles', () => {
    const id: number = 1;
    service.getProyectoUsuariosRoles(id).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/usuarios/roles', 'get');
    expect(req.request.method).toBe('GET');
  });

  it('should get proyectos usuarios roles', () => {
    const id: number = 1;
    service.getProyectosUsuariosRoles().subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/usuarios/roles', 'get');
    expect(req.request.method).toBe('GET');
  });

  it('should post a proyecto', () => {
    const data = { nombre: 'nombre', descripcion: 'descripcion', idusuario: 1 };
    service.crearProyecto(data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url, 'post');
    expect(req.request.method).toBe('POST');
  });

  it('should update a proyecto', () => {
    const id: number = 1;
    const data = { nombre: 'nombre', descripcion: 'descripcion', idusuario: 1 };
    service.actualizarProyecto(id, data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id, 'put');
    expect(req.request.method).toBe('PUT');
  });

  it('should get proyecto pbis', () => {
    const id: number = 1;
    service.getProyectoPBIs(id).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/pbis', 'get');
    expect(req.request.method).toBe('GET');
  });

  it('should get proyecto sprintgoals', () => {
    const id: number = 1;
    service.getProyectoSprintGoals(id).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/sprintgoals', 'get');
    expect(req.request.method).toBe('GET');
  });

  it('should invite user', () => {
    const id: number = 1;
    const data = { email: 'email', rol: 'rol', nombreProyecto: 'nombre', invitadoPor: 'usuario' };
    service.invitarUsuario(id, data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/invitar', 'get');
    expect(req.request.method).toBe('POST');
  });

  it('should delete a usuario', () => {
    const id = 1,
      idusuario = 2;
    service.eliminarUsuario(id, idusuario).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/eliminarUsuario' + '/' + idusuario, 'delete');
    expect(req.request.method).toBe('DELETE');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
