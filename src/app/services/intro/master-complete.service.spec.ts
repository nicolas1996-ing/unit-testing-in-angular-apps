import { TestBed } from '@angular/core/testing';

import { MasterCompleteService } from './master-complete.service';
import { ValueService } from './value.service';

fdescribe('MasterCompleteService', () => {
  let masterCompleteService: MasterCompleteService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>; // spy A.

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ValueService', ['getValue']); // spy A.

    TestBed.configureTestingModule({
      providers: [
        MasterCompleteService,
        { provide: ValueService, useValue: spy }, // use service spy
      ],
      imports: [],
    });
    masterCompleteService = TestBed.inject(MasterCompleteService); // main service
    valueServiceSpy = TestBed.inject(
      ValueService
    ) as jasmine.SpyObj<ValueService>; // spy A.
  });

  it('should be created', () => {
    expect(masterCompleteService).toBeTruthy();
  });

  it('should call to getValue() from valueService', () => {
    valueServiceSpy.getValue.and.returnValue('FAKE-VALUE'); // when getValue be called return FAKE-VALUE
    const getValueService = masterCompleteService.getValue();

    expect(getValueService).toBe('FAKE-VALUE');
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });
});
