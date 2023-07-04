import { describe, it, expect } from 'vitest';
import { numberToString } from './numberToString';

describe('numberToString', () => {
  describe('in', () => {
    it('should return undefined if input is falsy', () => {
      expect(numberToString.in(null)).toBeUndefined();
      expect(numberToString.in(undefined)).toBeUndefined();
      expect(numberToString.in(false)).toBeUndefined();
      expect(numberToString.in('')).toBeUndefined();
      expect(numberToString.in(0)).toBe(0);
      expect(numberToString.in(123)).toEqual(123);
      expect(numberToString.in('123')).toEqual(123);
      expect(numberToString.in('123.123')).toEqual(123.123);
    });
  });

  describe('out', () => {
    it('should return undefined if input is null or undefined', () => {
      expect(numberToString.out(null)).toBeUndefined();
      expect(numberToString.out(undefined)).toBeUndefined();
    });

    it('should convert value to string', () => {
      expect(numberToString.out(1)).toBe('1');
      expect(numberToString.out(0)).toBe('0');
    });
  });
});
