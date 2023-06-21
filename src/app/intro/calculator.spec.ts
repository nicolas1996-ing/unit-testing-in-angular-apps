import { Calculator } from './calculator';

describe('test for calculator component', () => {
  describe('multiply test', () => {
    it('#multiply should return 9', () => {
      const calculator = new Calculator();
      const rtaMul = calculator.multiply(3, 3);
      expect(rtaMul).toEqual(9);
    });
  });

  describe('divide test', () => {
    it('#divide should return null', () => {
      const calculator = new Calculator();
      const rtaDiv = calculator.divide(3, 0);
      expect(rtaDiv).toBeNull();
    });
    it('#divide should return a some numbers', () => {
      const calculator = new Calculator();
      const rtaDiv = calculator.divide(3, 3);
      expect(rtaDiv).toEqual(1);
      expect(rtaDiv).not.toBeNull();
    });
  });

  describe('matchers test', () => {
    it('test on matchers', () => {
      let name = 'nicolas';
      let name2;

      expect(name).toBeDefined();
      expect(name2).toBeUndefined();
      expect(1 + 3 == 4).toBeTruthy();
      expect(5).toBeLessThan(10);
      expect(5).toBeGreaterThan(4);
      expect('1234').toMatch(/123/);
      expect(['apples', 'oranges', 'pears']).toContain('apples');
    });
  });
});
