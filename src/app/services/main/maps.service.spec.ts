import { TestBed } from '@angular/core/testing';

import { MapsService } from './maps.service';

fdescribe('MapsService', () => {
  let mapsService: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapsService],
    });
    mapsService = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(mapsService).toBeTruthy();
  });

  describe('test for getCurrentPosition', () => {
    it('should save the center', () => {
      // mock data
      // callFake: permite escribir una version fake de la funcion getCurrentPosition
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(
        (successFn) => {
          // construir un mock de lo que responderia la fx real
          const mockGeolocation = {
            coords: {
              accuracy: 0,
              altitude: 0,
              altitudeAccuracy: 0,
              heading: 0,
              latitude: 1000,
              longitude: 1000,
              speed: 0,
            },
            timestamp: 0,
          };
          successFn(mockGeolocation);
        }
      );

      // call function
      mapsService.getCurrentPosition();

      // test
      expect(mapsService.center.lat).toEqual(1000);
      expect(mapsService.center.long).toEqual(1000);
    });
  });
});
