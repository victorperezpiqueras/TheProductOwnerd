import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CriteriosService } from './criterios.service';

describe('CriteriosService', () => {
  let service: CriteriosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CriteriosService]
    });
    service = TestBed.get(CriteriosService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post a criterio', () => {
    const data = { nombre: 'archivo', done: 1, idpbi: 1 };
    service.crearCriterio(data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url, 'post');
    expect(req.request.method).toBe('POST');
  });

  it('should delete an archivo', () => {
    const id = 1;
    service.borrarCriterio(id).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id, 'delete');
    expect(req.request.method).toBe('DELETE');
  });

  it('should update an archivo', () => {
    const data = { nombre: 'archivo', done: 1, idcriterio: 1 };
    service.actualizarCriterio(data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + data.idcriterio, 'put');
    expect(req.request.method).toBe('PUT');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
