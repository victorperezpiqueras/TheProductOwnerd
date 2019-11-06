/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HolamundoService } from './holamundo-service.service';

describe('Service: HolamundoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HolamundoService]
    });
  });

  it('should ...', inject([HolamundoService], (service: HolamundoService) => {
    expect(service).toBeTruthy();
  }));
});
