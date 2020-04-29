import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegistroService } from './registro.service';

describe('RegistroService', () => {
  let service: RegistroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegistroService]
    });
    service = TestBed.get(RegistroService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should register', () => {
    const data = { nick: 'a', nombre: 'a', apellido1: 'a', apellido2: 'a', password: 'a', email: 'a' };
    service.registrar(data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url, 'post');
    expect(req.request.method).toBe('POST');
  });

  it('should register with invitation', () => {
    const data = { token: 'a', nick: 'a', nombre: 'a', apellido1: 'a', apellido2: 'a', password: 'a', email: 'a' };
    service.registrarPorInvitacion(data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/invitar', 'post');
    expect(req.request.method).toBe('POST');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
