import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });
    service = TestBed.get(LoginService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should login', () => {
    const data = { email: 'email', password: 'password' };
    service.login(data).subscribe((data: any) => {});
    const req = httpMock.expectOne(service.url, 'post');
    expect(req.request.method).toBe('POST');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
