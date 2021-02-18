import { TestBed } from '@angular/core/testing';

import { NrpService } from './nrp.service';

describe('NrpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NrpService = TestBed.get(NrpService);
    expect(service).toBeTruthy();
  });
});
