import { describe, expect, test } from 'vitest';
import { createT } from './instance';

describe('i18n', () => {
  test('t', () => {
    const t = createT({
      a: '令白鸟哀叹的天空之蓝',
      b: '无法浸染的大海之青, {c}',
    });
    expect(t('a')).toBe('令白鸟哀叹的天空之蓝');
    expect(t('a1')).toBe('');
    expect(t('b', { c: '相互映照' })).toBe('无法浸染的大海之青, 相互映照');
    expect(t('b')).toBe('无法浸染的大海之青, {c}');
    expect(t('b', {})).toBe('无法浸染的大海之青, ');
  });
});
