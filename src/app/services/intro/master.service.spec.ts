import { MasterService } from './master.service';
import { ValueService } from './value.service';
import { FakeValueService } from './mock/value.service.fake';

fdescribe('MasterService', () => {
  let masterService: MasterService;
  let valueService: ValueService;

  beforeEach(() => {});

  it('should be created', () => {
    valueService = new ValueService();
    masterService = new MasterService(valueService);
    expect(masterService).toBeTruthy();
  });

  it('should return MY_VALUE from the real service', () => {
    const valueService = new ValueService();
    const masterService = new MasterService(valueService);
    const getValueService = masterService.getValue();
    expect(getValueService).toBe('MY_VALUE');
  });

  it('should return FAKE-VALUE from the fake service', () => {
    const fakeValueService = new FakeValueService();
    const masterService = new MasterService(
      fakeValueService as unknown as ValueService
    );
    const getValueService = masterService.getValue();
    expect(getValueService).toBe('FAKE-VALUE');
  });

  it('should return FAKE-VALUE from the fake object', () => {
    const fakeValueService = { getValue: () => 'FAKE-VALUE' };
    const masterService = new MasterService(fakeValueService as ValueService);
    const getValueService = masterService.getValue();
    expect(getValueService).toBe('FAKE-VALUE');
  });

  it('should call to getValue() from valueService', () => {
    const valueSeviceSpy = jasmine.createSpyObj('ValueService', ['getValue']); // SPY: service mock
    valueSeviceSpy.getValue.and.returnValue('FAKE-VALUE'); // "when getValue be called return FAKE-VALUE"
    const masterService = new MasterService(valueSeviceSpy);
    const getValueService = masterService.getValue();

    expect(getValueService).toBe('FAKE-VALUE');
    expect(valueSeviceSpy.getValue).toHaveBeenCalled();
    expect(valueSeviceSpy.getValue).toHaveBeenCalledTimes(1);
  });
});
