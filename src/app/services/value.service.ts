import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValueService {
  private value: string = 'MY_VALUE';

  constructor() {}

  getValue() {
    return this.value;
  }

  setValue(newValue: string) {
    this.value = newValue;
  }

  getPromiseValue() {
    return Promise.resolve('value-promise');
  }

  getObservable() {
    return of('value-observable');
  }
}
