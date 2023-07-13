import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Auth } from 'src/app/models/auth.model';
import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpController: HttpTestingController; // services test http request
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, TokenService],
      imports: [HttpClientTestingModule],
    });
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController); // mock http request
    tokenService = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('test on login', () => {
    // evaluamos el login
    it('should return a new token', (doneFn) => {
      // mock data
      const mockData: Auth = { access_token: 'new-token-123' };
      const email = 'email-test@gmail.com';
      const password = 'password-test-123';

      // request
      authService.login(email, password).subscribe({
        next: (resp) => {
          expect(resp).toEqual(mockData);
          doneFn();
        },
      });

      // mock request response
      const URL_BASE = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(URL_BASE); // request http
      expect(req.request.body).toEqual({ email, password });
      expect(req.request.method).toEqual('POST');

      req.flush(mockData); // return data mock
    });

    // evaluamos que el token se guarde
    it('should save token with tokenService', (doneFn) => {
      // mock data
      const mockData: Auth = { access_token: 'new-token-123' };
      const email = 'email-test@gmail.com';
      const password = 'password-test-123';

      // spy de tokenService
      spyOn(tokenService, 'saveToken').and.callThrough();

      // request
      authService.login(email, password).subscribe({
        next: (resp) => {
          expect(resp).toEqual(mockData);

          // test sobre tokenService
          expect(tokenService.saveToken).toHaveBeenCalled();
          expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
          expect(tokenService.saveToken).toHaveBeenCalledWith('new-token-123');
          doneFn();
        },
      });

      // mock request response
      const URL_BASE = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(URL_BASE); // request http
      expect(req.request.body).toEqual({ email, password });
      expect(req.request.method).toEqual('POST');

      req.flush(mockData); // return data mock
    });
  });
});
