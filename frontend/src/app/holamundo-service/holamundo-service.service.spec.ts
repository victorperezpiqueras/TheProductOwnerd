/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HolamundoService } from './holamundo-service.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: HolamundoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HolamundoService]
    });
  });

  it('should ...', inject([HolamundoService], (service: HolamundoService) => {
    expect(service).toBeTruthy();
  }));
});
