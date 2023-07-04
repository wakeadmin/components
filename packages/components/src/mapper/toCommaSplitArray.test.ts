import { describe, it, expect } from 'vitest';
import { toCommaSplitArray, toCommaSplitNumberArray } from './toCommaSplitArray';

describe('toCommaSplitArray', () => {
  describe('in', () => {
    it('should return empty array if input is null or undefined', () => {
      expect(toCommaSplitArray.in(null)).toEqual([]);
      expect(toCommaSplitArray.in(undefined)).toEqual([]);
    });

    it('should return empty array if input is not a string', () => {
      expect(toCommaSplitArray.in(123)).toEqual([]);
      expect(toCommaSplitArray.in({})).toEqual([]);
    });

    it('should split comma-separated string into array', () => {
      const input = 'a, b, c';
      const expectedOutput = ['a', 'b', 'c'];
      expect(toCommaSplitArray.in(input)).toEqual(expectedOutput);
    });

    it('should trim whitespace around items', () => {
      const input = ' a , b , c ';
      const expectedOutput = ['a', 'b', 'c'];
      expect(toCommaSplitArray.in(input)).toEqual(expectedOutput);
    });
  });

  describe('out', () => {
    it('should return empty string if input is not an array', () => {
      expect(toCommaSplitArray.out(null)).toEqual('');
      expect(toCommaSplitArray.out(undefined)).toEqual('');
      expect(toCommaSplitArray.out('not an array')).toEqual('');
      expect(toCommaSplitArray.out(123)).toEqual('');
      expect(toCommaSplitArray.out({})).toEqual('');
    });

    it('should join array into comma-separated string', () => {
      const input = ['a', 'b', 'c'];
      const expectedOutput = 'a,b,c';
      expect(toCommaSplitArray.out(input)).toEqual(expectedOutput);
    });
  });
});

describe('toCommaSplitNumberArray', () => {
  describe('in', () => {
    it('should return empty array if input is null or undefined', () => {
      expect(toCommaSplitNumberArray.in(null)).toEqual([]);
      expect(toCommaSplitNumberArray.in(undefined)).toEqual([]);
    });

    it('should return empty array if input is not a string', () => {
      expect(toCommaSplitNumberArray.in(123)).toEqual([]);
      expect(toCommaSplitNumberArray.in({})).toEqual([]);
    });

    it('should split comma-separated string into array of numbers', () => {
      const input = '1, 2, 3';
      const expectedOutput = [1, 2, 3];
      expect(toCommaSplitNumberArray.in(input)).toEqual(expectedOutput);
    });

    it('should trim whitespace around items', () => {
      const input = ' 1 , 2 , 3 ';
      const expectedOutput = [1, 2, 3];
      expect(toCommaSplitNumberArray.in(input)).toEqual(expectedOutput);
    });

    it('should return empty array if any item is not a number', () => {
      const input = '1, not a number, 3, 3.8';
      expect(toCommaSplitNumberArray.in(input)).toEqual([1, 3, 3.8]);
    });
  });

  describe('out', () => {
    it('should return empty string if input is not an array', () => {
      expect(toCommaSplitNumberArray.out(null)).toEqual('');
      expect(toCommaSplitNumberArray.out(undefined)).toEqual('');
      expect(toCommaSplitNumberArray.out('not an array')).toEqual('');
      expect(toCommaSplitNumberArray.out(123)).toEqual('');
      expect(toCommaSplitNumberArray.out({})).toEqual('');
    });

    it('should join array of numbers into comma-separated string', () => {
      const input = [1, 2, 3];
      const expectedOutput = '1,2,3';
      expect(toCommaSplitNumberArray.out(input)).toEqual(expectedOutput);
    });
  });
});
