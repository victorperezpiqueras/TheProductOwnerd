import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArchivosService } from './archivos.service';

describe('ArchivosService', () => {
  let service: ArchivosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArchivosService]
    });
    service = TestBed.get(ArchivosService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post an archivo', () => {
    const data = { nombre: 'archivo', src: 'src', idpbi: 1, idusuario: 1 };
    service.crearArchivo(data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url, 'post');
    expect(req.request.method).toBe('POST');
  });

  it('should delete an archivo', () => {
    const id = 1;
    service.borrarArchivo(id).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id, 'delete');
    expect(req.request.method).toBe('DELETE');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
