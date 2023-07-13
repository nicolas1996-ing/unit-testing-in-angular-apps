import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from '../../models/product.model';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import {
  generateManyProduct,
  generateOneProduct,
} from '../../models/mocks/product.mock';
import { HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../../interceptors/token.interceptor';
import { TokenService } from './token.service';

describe('ProductService', () => {
  let productService: ProductService;
  let httpController: HttpTestingController; // services test http request
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
      imports: [HttpClientTestingModule],
    });
    productService = TestBed.inject(ProductService);
    httpController = TestBed.inject(HttpTestingController); // mock http request
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    // obligatorio incluir esta linea en cada prueba http
    httpController.verify();
  });

  it('should be created', () => {
    expect(productService).toBeTruthy();
  });

  describe('test for getAllSimple method', () => {
    it('should return a product list', (doneFn) => {
      // mock http request
      const mockData: Product[] = generateManyProduct();

      // request
      productService.getAllSimple().subscribe({
        next: (resp) => {
          expect(resp.length).toEqual(mockData.length);
          doneFn();
        },
      });

      // mock request response
      const URL_BASE = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(URL_BASE); // request http
      req.flush(mockData); // return data mock
    });
  });

  describe('test for getAll', () => {
    it('should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProduct();

      // interceptor: como tenemos un token disponible el request es interceptado
      // y esta info es agregado en los headers del request [ver interceptor]
      // crear spy para el interceptor . [ Otra forma de crear el spy ]
      const tokenFake = 'token-fake';
      spyOn(tokenService, 'getToken').and.returnValue(tokenFake);

      // request
      productService.getAll().subscribe({
        next: (resp) => {
          expect(resp.length).toEqual(mockData.length);
          doneFn();
        },
      });

      // mock request response
      const URL_BASE = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(URL_BASE); // request http
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual(`Bearer ${tokenFake}`); // token add
      req.flush(mockData); // return data mock
    });

    it('should return a product list with taxes', (doneFn) => {
      const mockData: Product[] = [
        { ...generateOneProduct(), price: 100 },
        { ...generateOneProduct(), price: 200 },
        { ...generateOneProduct(), price: 0 }, // other test cases
        { ...generateOneProduct(), price: -100 }, // should be taxes = 0
      ];

      // request
      productService.getAll().subscribe({
        next: (resp) => {
          expect(resp.length).toEqual(mockData.length);
          expect(resp[0].taxes).toEqual(100 * 0.19);
          expect(resp[1].taxes).toEqual(200 * 0.19);
          expect(resp[2].taxes).toEqual(0);
          expect(resp[3].taxes).toEqual(0);
          doneFn();
        },
      });

      // mock request response
      const URL_BASE = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(URL_BASE); // request http
      req.flush(mockData); // return data mock
    });

    it('should send query params with limit=10 and offset=3', (doneFn) => {
      const limit = 10;
      const offset = 3;
      const mockData: Product[] = generateManyProduct();

      // request
      // la url que usar getAll será URL_BASE
      productService.getAll(limit, offset).subscribe({
        next: (resp) => {
          expect(resp.length).toEqual(mockData.length);
          doneFn();
        },
      });

      // mock request response
      const URL_BASE = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(URL_BASE); // request http
      req.flush(mockData); // return data mock
      const params = req.request.params;

      // test in query params
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    });
  });

  describe('test for POST method', () => {
    it('should return a new product', () => {
      // mock data
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'new product',
        price: 100,
        images: ['img'],
        description: 'description',
        categoryId: 1,
      };

      productService.create({ ...dto }).subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
        },
      });

      const URL_BASE = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(URL_BASE); // request http
      req.flush(mockData); // return data mock

      // verificar que no se modifique el body
      expect(req.request.body).toEqual(dto);
      // verificar que se use http method correcto
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('test for UPDATE method', () => {
    it('should update a product', (doneFn) => {
      // mock data
      const mockData: Product = generateOneProduct();
      const dto: UpdateProductDTO = { title: 'new title' };
      const productId = '1';

      // request
      productService.update(productId, { ...dto }).subscribe((data) => {
        // test
        expect(data).toEqual(mockData);
        doneFn();
      });

      // mock request basado en la peticion anterior
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);

      // test
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('PUT');

      // retonar data mock cuando se haga el llamado con los parametro de url
      req.flush(mockData);
    });
  });

  describe('test for DELETE method', () => {
    it('should detele a product', () => {
      // mock data
      const mockData = true;
      const productId = '1';

      // request
      productService.delete(productId).subscribe((resp) => {
        // test
        expect(resp).toBe(mockData);
      });

      // mock request basado en el request anterior
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);

      // test
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);
    });
  });

  describe('test for getOne method', () => {
    // happy path
    it('should return a product', (doneFn) => {
      // mock data
      const productId = '1';
      const mockData: Product = generateOneProduct();

      // request
      productService.getOne(productId).subscribe({
        next: (product) => {
          expect(product).toEqual(mockData);
          doneFn();
        },
      });

      // mock request ( http config )
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET'); // test
      req.flush(mockData);
    });

    // error
    it('should return an error message when status code is 404', (doneFn) => {
      const productId = '1';
      const messageError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: messageError,
      };

      // request
      productService.getOne(productId).subscribe({
        next: (_) => {},
        error: (err) => {
          // test
          expect(err).toEqual('El producto no existe');
          doneFn();
        },
      });

      // mock request
      // mock request ( http config )
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET'); // test
      req.flush(messageError, mockError); // simular un error
    });

    it('should return an error message when status code is 409', (doneFn) => {
      const productId = '1';
      const messageError = '409 message';
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: messageError,
      };

      // request
      productService.getOne(productId).subscribe({
        next: (_) => {},
        error: (err) => {
          // test
          expect(err).toEqual('Algo esta fallando en el server');
          doneFn();
        },
      });

      // mock request
      // mock request ( http config )
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET'); // test
      req.flush(messageError, mockError); // simular un error
    });

    it('should return an error message when status code is 409', (doneFn) => {
      const productId = '1';
      const messageError = '401 message';
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: messageError,
      };

      // request
      productService.getOne(productId).subscribe({
        next: (_) => {},
        error: (err) => {
          // test
          expect(err).toEqual('No estas permitido');
          doneFn();
        },
      });

      // mock request
      // mock request ( http config )
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET'); // test
      req.flush(messageError, mockError); // simular un error
    });

    it('should return an error message when status code is 409', (doneFn) => {
      const productId = '1';
      const messageError = '500 message';
      const mockError = {
        status: 500,
        statusText: messageError,
      };

      // request
      productService.getOne(productId).subscribe({
        next: (_) => {},
        error: (err) => {
          // test
          expect(err).toEqual('Ups algo salio mal');
          doneFn();
        },
      });

      // mock request
      // mock request ( http config )
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toBe('GET'); // test
      req.flush(messageError, mockError); // simular un error
    });
  });
});
