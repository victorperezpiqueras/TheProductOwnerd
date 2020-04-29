import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PbisService } from './pbis.service';
import { Pbi } from '@app/models/pbis';

describe('PbisService', () => {
  let service: PbisService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PbisService]
    });
    service = TestBed.get(PbisService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a pbi', () => {
    const data: Pbi = {
      idpbi: 1,
      titulo: '',
      descripcion: '',
      done: 1,
      label: '',
      estimacion: 1,
      valor: 1,
      idproyecto: 1,
      prioridad: 1,
      sprintCreacion: 1,
      sprint: 1
    };
    service.crearPbi(data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url, 'post');
    expect(req.request.method).toBe('POST');
  });

  it('should update a pbi', () => {
    const data: Pbi = {
      idpbi: 1,
      titulo: '',
      descripcion: '',
      done: 1,
      label: '',
      estimacion: 1,
      valor: 1,
      idproyecto: 1,
      prioridad: 1,
      sprintCreacion: 1,
      sprint: 1
    };
    service.editarPbi(data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + data.idproyecto, 'put');
    expect(req.request.method).toBe('PUT');
  });

  it('should update pbi priorities', () => {
    const data: Pbi = {
      idpbi: 1,
      titulo: '',
      descripcion: '',
      done: 1,
      label: '',
      estimacion: 1,
      valor: 1,
      idproyecto: 1,
      prioridad: 1,
      sprintCreacion: 1,
      sprint: 1
    };
    const data2: Pbi = {
      idpbi: 1,
      titulo: '',
      descripcion: '',
      done: 1,
      label: '',
      estimacion: 1,
      valor: 1,
      idproyecto: 1,
      prioridad: 1,
      sprintCreacion: 1,
      sprint: 1
    };
    service.editarPrioridadesPbis([data, data2]).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url, 'put');
    expect(req.request.method).toBe('PUT');
  });

  it('should get comentarios', () => {
    const id: number = 1;
    service.obtenerComentarios(id).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/comentarios', 'get');
    expect(req.request.method).toBe('GET');
  });

  it('should get archivos', () => {
    const id: number = 1;
    service.obtenerArchivos(id).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/archivos', 'get');
    expect(req.request.method).toBe('GET');
  });

  it('should get criterios', () => {
    const id: number = 1;
    service.obtenerCriterios(id).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/criterios', 'get');
    expect(req.request.method).toBe('GET');
  });

  it('should get dependencias', () => {
    const id: number = 1;
    service.obtenerDependencias(id).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url + '/' + id + '/dependencias', 'get');
    expect(req.request.method).toBe('GET');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
