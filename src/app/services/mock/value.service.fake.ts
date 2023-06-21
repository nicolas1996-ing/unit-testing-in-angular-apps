export class FakeValueService {
  constructor() {}
  getValue() {
    return 'FAKE-VALUE';
  }
  setValue(value: string) {}

  getPromiseValue() {
    return Promise.resolve('FAKE-PROMISE-VALUE');
  }
}
