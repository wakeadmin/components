import { test, expect } from 'vitest';
import { formatToMatcher, formatToReplacer } from './utils';

test('formatToMatcher', () => {
  expect(() => {
    formatToMatcher('');
  }).toThrow('format 必须包含 {default} 和 {uuid}');

  const res = formatToMatcher('__i18n__({default}, {uuid})');
  expect(String(res.regexp)).toBe(String(/__i18n__\(([\s\S]*?), ([\s\S]+?)\)/m));

  expect(res.match('__i18n__(a 121212,  121212b)')).toEqual({
    default: 'a 121212',
    uuid: '121212b',
  });

  // default 为空
  expect(res.match('__i18n__(,  121212b)')).toEqual({
    default: '',
    uuid: '121212b',
  });

  expect(res.match('__i18n__(你好世界 () {} , 123)')).toEqual({
    default: '你好世界 () {} ',
    uuid: '123',
  });

  // 多行
  expect(res.match('__i18n__(你好\n\n \r\n 世界 () {} , 123)')).toEqual({
    default: '你好\n\n \r\n 世界 () {} ',
    uuid: '123',
  });

  // 未匹配
  expect(res.match('你好世界 () {}')).toEqual({
    default: '你好世界 () {}',
  });

  const res2 = formatToMatcher('{{uuid}, {default}}');
  expect(String(res2.regexp)).toBe(String(/\{([\s\S]+?), ([\s\S]*?)\}/m));
  expect(res2.match('{you, ok?}')).toEqual({
    default: 'ok?',
    uuid: 'you',
  });
});

test('formatToReplacer', () => {
  expect(() => {
    formatToReplacer('');
  }).toThrow('format 必须包含 {default} 和 {uuid}');

  const res = formatToReplacer('__i18n__({default}, {uuid})');
  expect(res({ default: 'hello world' })).toBe('hello world');
  expect(res({ default: 'hello world', uuid: '123' })).toBe('__i18n__(hello world, 123)');
});
