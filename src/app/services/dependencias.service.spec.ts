import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DependenciasService } from './dependencias.service';

describe('DependenciasService', () => {
  let service: DependenciasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DependenciasService]
    });
    service = TestBed.get(DependenciasService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post a dependencia', () => {
    const data = { idpbi: 1, idpbi2: 2 };
    service.crearDependencia(data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url, 'post');
    expect(req.request.method).toBe('POST');
  });

  it('should delete a dependencia', () => {
    const id = 1,
      id2 = 2;
    service.borrarDependencia(id, id2).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/' + id2, 'delete');
    expect(req.request.method).toBe('DELETE');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
