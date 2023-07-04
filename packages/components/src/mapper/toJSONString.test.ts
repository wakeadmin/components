import { describe, it, expect } from 'vitest';
import { toJSONArrayString, toJSONObjectString } from './toJSONString';

describe('toJSONArrayString', () => {
  it('should return empty array if input is null or undefined', () => {
    expect(toJSONArrayString.in(null)).toEqual([]);
    expect(toJSONArrayString.in(undefined)).toEqual([]);
  });

  it('should return parsed array if input is valid JSON string', () => {
    const input = '[1, 2, 3]';
    const expectedOutput = [1, 2, 3];
    expect(toJSONArrayString.in(input)).toEqual(expectedOutput);
  });

  it('should return empty array if input is not a valid JSON string', () => {
    const input = 'not a JSON string';
    expect(toJSONArrayString.in(input)).toEqual([]);
  });

  it('should return stringified JSON if input is an array', () => {
    const input = [1, 2, 3];
    const expectedOutput = '[1,2,3]';
    expect(toJSONArrayString.out(input)).toEqual(expectedOutput);
  });

  it('should return empty string if input is null or undefined', () => {
    expect(toJSONArrayString.out(null)).toEqual('');
    expect(toJSONArrayString.out(undefined)).toEqual('');
  });
});

describe('toJSONObjectString', () => {
  it('should return empty object if input is null or undefined', () => {
    expect(toJSONObjectString.in(null)).toEqual({});
    expect(toJSONObjectString.in(undefined)).toEqual({});
  });

  it('should return parsed object if input is valid JSON string', () => {
    const input = '{"a": 1, "b": 2}';
    const expectedOutput = { a: 1, b: 2 };
    expect(toJSONObjectString.in(input)).toEqual(expectedOutput);
  });

  it('should return empty object if input is not a valid JSON string', () => {
    const input = 'not a JSON string';
    expect(toJSONObjectString.in(input)).toEqual({});
  });

  it('should return stringified JSON if input is an object', () => {
    const input = { a: 1, b: 2 };
    const expectedOutput = '{"a":1,"b":2}';
    expect(toJSONObjectString.out(input)).toEqual(expectedOutput);
  });

  it('should return empty string if input is null or undefined', () => {
    expect(toJSONObjectString.out(null)).toEqual('');
    expect(toJSONObjectString.out(undefined)).toEqual('');
  });
});
