// import { TestBed } from '@angular/core/testing';
import { ValueService } from './value.service';

fdescribe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    // TestBed.configureTestingModule({});
    // service = TestBed.inject(ValueService);
    service = new ValueService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('test for getValue function', () => {
    it('should return value', () => {
      const value = service.getValue();
      expect(value).toBe('MY_VALUE');
    });
  });

  describe('test for setValue function', () => {
    it('should set value', () => {
      const value = service.getValue();
      expect(value).toBe('MY_VALUE');
      service.setValue('MY_NEW_VALUE');
      expect(service.getValue()).toBe('MY_NEW_VALUE');
    });
  });

  // asyn - promise 
  describe('test for promise function', () => {
    it('should return "value-promise" from promise with then', (doneFn) => {
      service.getPromiseValue().then((resp) => {
        expect(resp).toBe('value-promise');
        doneFn();
      });
    });
  });

  describe('test for promise function', () => {
    it('should return "value-promise" from promise with async', async () => {
      const rta = await service.getPromiseValue();
      expect(rta).toBe('value-promise');
    });
  });

  // observable
  describe('test for observable function', () => {
    it('should return "value-observable" from observable', (doneFn) => {
      service.getObservable().subscribe({
        next: (rta) => {
          expect(rta).toBe('value-observable');
          doneFn();
        },
      });
    });
  });
});
