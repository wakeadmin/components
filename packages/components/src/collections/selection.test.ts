import { beforeEach, describe, expect, test, vi } from 'vitest';
import { SelectionModel } from './selection';

describe('SelectionModel', () => {
  describe('单选', () => {
    let model: SelectionModel<any>;

    beforeEach(() => {
      model = new SelectionModel();
    });

    test('基操', () => {
      model.select(1);

      expect(model.selected.length).toBe(1);
      expect(model.isSelected(1)).toBe(true);
    });

    test('选择多个', () => {
      model.select(1);
      model.select(2);

      expect(model.isSelected(1)).toBe(false);
      expect(model.isSelected(2)).toBe(true);
    });

    test('一次性选择多个', () => {
      expect(() => model.select(1, 2)).toThrow();
    });

    test('初始化传入多个值', () => {
      model = new SelectionModel(false, [1, 2]);

      expect(model.selected.length).toBe(1);
      expect(model.isSelected(1)).toBe(true);
      expect(model.isSelected(2)).toBe(false);
    });
  });

  describe('多选', () => {
    let model: SelectionModel<any>;

    beforeEach(() => {
      model = new SelectionModel(true);
    });

    test('基操', () => {
      const changedSpy = vi.fn();

      model.subscribe(changedSpy);
      model.select(1);
      model.select(2);

      expect(model.selected.length).toBe(2);
      expect(model.isSelected(1)).toBe(true);
      expect(model.isSelected(2)).toBe(true);
      expect(changedSpy).toHaveBeenCalledTimes(2);
    });

    test('一次选择多个', () => {
      const changedSpy = vi.fn();

      model.subscribe(changedSpy);
      model.select(1, 2);

      expect(model.selected.length).toBe(2);
      expect(model.isSelected(1)).toBe(true);
      expect(model.isSelected(2)).toBe(true);
      expect(changedSpy).toHaveBeenCalledTimes(1);
    });

    test('默认值', () => {
      model = new SelectionModel(true, [1, 2]);

      expect(model.selected.length).toBe(2);
      expect(model.isSelected(1)).toBe(true);
      expect(model.isSelected(2)).toBe(true);
    });
  });

  describe('限制个数多选', () => {
    let model: SelectionModel<any>;

    beforeEach(() => {
      model = new SelectionModel<any>(true, [], 3);
    });

    test('基操', () => {
      model.select(1);
      model.select(2);
      model.select(3);
      model.select(4);

      expect(model.selected.length).toBe(3);
      expect(model.isSelected(1)).toBe(true);
      expect(model.isSelected(2)).toBe(true);
      expect(model.isSelected(3)).toBe(true);
      expect(model.isSelected(4)).toBe(false);
    });

    test('一次选择多个', () => {
      model.select(1, 2, 3, 4);

      expect(model.selected.length).toBe(3);
      expect(model.isSelected(1)).toBe(true);
      expect(model.isSelected(2)).toBe(true);
      expect(model.isSelected(3)).toBe(true);
      expect(model.isSelected(4)).toBe(false);
      expect(model.exceeded).toBe(true);
    });

    test('默认值', () => {
      model = new SelectionModel(true, [1, 2], 3);

      expect(model.selected.length).toBe(2);
      expect(model.isSelected(1)).toBe(true);
      expect(model.isSelected(2)).toBe(true);
      expect(model.exceeded).toBe(false);

      model.select(3, 4);
      expect(model.selected.length).toBe(3);
      expect(model.isSelected(3)).toBe(true);
      expect(model.isSelected(4)).toBe(false);
      expect(model.exceeded).toBe(true);
    });

    test('状态变化', () => {
      model = new SelectionModel(true, [1, 2], 3);
      expect(model.exceeded).toBe(false);

      model.select(3, 4);

      expect(model.exceeded).toBe(true);

      model.unselect(1, 2);

      expect(model.exceeded).toBe(false);
    });

    test('切换状态', () => {
      model = new SelectionModel(true, [3, 4], 3);

      model.toggle(1, 2, 3, 4, 5);

      expect(model.selected.length).toBe(3);
      expect(model.selected).toEqual([1, 2, 5]);
    });
  });

  describe('监听变化', () => {
    test('基操', () => {
      let model = new SelectionModel();
      let spy = vi.fn();

      model.select(1);

      model.subscribe(spy);

      model.select(2);

      let event = spy.mock.lastCall![0];

      expect(spy).toHaveBeenCalled();
      expect(event.removed).toEqual([1]);
      expect(event.added).toEqual([2]);
    });
  });

  test('empty判断', () => {
    let model = new SelectionModel();

    expect(model.isEmpty()).toBe(true);

    model.select(1);

    expect(model.isEmpty()).toBe(false);
  });

  test('切换选择', () => {
    let model = new SelectionModel();

    model.toggle(1);
    expect(model.isSelected(1)).toBe(true);

    model.toggle(1);
    expect(model.isSelected(1)).toBe(false);
  });

  test('清空', () => {
    let model = new SelectionModel(true);

    model.select(1);
    model.select(2);

    expect(model.selected.length).toBe(2);

    model.clear();

    expect(model.selected.length).toBe(0);
    expect(model.isEmpty()).toBe(true);
  });

  test('获取初始值', () => {
    expect(new SelectionModel(false, []).selected).toEqual([]);
  });
});
