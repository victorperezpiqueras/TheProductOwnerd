import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SprintGoalsService } from './sprintgoals.service';
import { SprintGoal } from '@app/models/sprintGoals';

describe('SprintGoalsService', () => {
  let service: SprintGoalsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SprintGoalsService]
    });
    service = TestBed.get(SprintGoalsService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post a sprint goal', () => {
    const data: SprintGoal = { idproyecto: 1, goal: 'a', sprintNumber: 1 };
    service.crearSprintGoal(data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url, 'post');
    expect(req.request.method).toBe('POST');
  });

  it('should update a sprint goal', () => {
    const data: SprintGoal = { idproyecto: 1, goal: 'a', sprintNumber: 1 };
    service.actualizarSprintGoal(data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url, 'put');
    expect(req.request.method).toBe('PUT');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
