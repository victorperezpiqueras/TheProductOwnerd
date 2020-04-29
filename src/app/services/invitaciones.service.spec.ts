import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InvitacionesService } from './invitaciones.service';

describe('InvitacionesService', () => {
  let service: InvitacionesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InvitacionesService]
    });
    service = TestBed.get(InvitacionesService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get an invitacion', () => {
    const token = '123';
    service.obtenerInvitacion(token).subscribe((data: any) => {
      expect(data.token).toBe(token);
    });
    const req = httpMock.expectOne(service.url + '/' + token, 'post');
    expect(req.request.method).toBe('GET');
    req.flush({
      token: token
    });
  });

  it('no invitation', () => {
    const token = '123';
    service.obtenerInvitacion(token).subscribe((data: any) => {
      expect(data.token).toBe(undefined);
    });
    const req = httpMock.expectOne(service.url + '/' + token, 'post');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  afterEach(() => {
    httpMock.verify();
  });
});
