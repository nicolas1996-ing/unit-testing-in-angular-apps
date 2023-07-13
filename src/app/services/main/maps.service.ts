import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  center = { lat: 0, long: 0 };

  constructor() {}

  getCurrentPosition() {
    // api del navegador
    navigator.geolocation.getCurrentPosition((resp) => {
      const { latitude, longitude } = resp.coords;
      this.center = {
        lat: latitude,
        long: longitude,
      };
    });
  }
}
