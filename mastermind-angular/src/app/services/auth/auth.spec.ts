import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login should store token in localStorage', () => {
    const mockResponse = { token: 'jwt-token' };

    service.login('felix', '123456').subscribe();

    const req = httpMock.expectOne('http://localhost:8080/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'felix', password: '123456' });
    req.flush(mockResponse);

    expect(localStorage.getItem('token')).toBe('jwt-token');
  });

  it('register should call correct endpoint', () => {
    service.register('felix', 'felix@email.com', '123456').subscribe();

    const req = httpMock.expectOne('http://localhost:8080/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'felix',
      email: 'felix@email.com',
      password: '123456'
    });
    req.flush({});
  });

  it('isLoggedIn should return true when token exists', () => {
    localStorage.setItem('token', 'jwt-token');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('isLoggedIn should return false when token does not exist', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('logout should remove token from localStorage', () => {
    localStorage.setItem('token', 'jwt-token');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('getUsername should return empty string when no token', () => {
    expect(service.getUsername()).toBe('');
  });

  it('getMe should call correct endpoint', () => {
    const mockUser = { id: 1, username: 'felix', email: 'felix@email.com', bestScore: 100 };

    service.getMe().subscribe(user => {
      expect(user.username).toBe('felix');
      expect(user.bestScore).toBe(100);
    });

    const req = httpMock.expectOne('http://localhost:8080/auth/me');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
