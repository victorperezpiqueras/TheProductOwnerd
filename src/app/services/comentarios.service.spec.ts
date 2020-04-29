import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComentariosService } from './comentarios.service';

describe('ComentariosService', () => {
  let service: ComentariosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ComentariosService]
    });
    service = TestBed.get(ComentariosService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post an comentario', () => {
    const data = { comentario: 'comentario', idpbi: 1, idusuarioÇ: 1, fecha: new Date() };
    service.crearComentario(data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url, 'post');
    expect(req.request.method).toBe('POST');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
