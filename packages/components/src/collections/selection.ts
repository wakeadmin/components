import { ref } from '@wakeadmin/demi';

export interface SelectionModelChange<T> {
  /**
   * 当前所选值
   */
  values: T[];
  /**
   * 删除值
   */
  removed: T[];
  /**
   * 新增值
   */
  added: T[];
}

export class SelectionModel<T> {
  private _selected: T[] | null = null;

  private selection = new Set<T>();

  private unselectedEmit: T[] = [];

  private selectedEmit: T[] = [];

  private listeners: ((payload: SelectionModelChange<T>) => void)[] = [];

  private _exceeded = ref(false);

  /**
   * 所选的值数量是否达到最大值
   */
  get exceeded(): boolean {
    return this._exceeded.value;
  }

  get selected(): T[] {
    if (!this._selected) {
      this._selected = Array.from(this.selection);
    }
    return this._selected;
  }

  get size(): number {
    return this.selection.size;
  }

  constructor(private multiple = false, initialSelectedValues?: T[], private limit: number = Infinity) {
    if (initialSelectedValues?.length) {
      if (multiple) {
        initialSelectedValues.forEach(value => this.markSelected(value));
      } else {
        this.markSelected(initialSelectedValues[0]);
      }
    }

    this.emitChange();
  }

  subscribe(fn: (payload: SelectionModelChange<T>) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(listen => listen !== fn);
    };
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  isMultiple() {
    return this.multiple;
  }

  isSelected(value: T): boolean {
    return this.selection.has(value);
  }

  toggle(...values: T[]): void {
    this.verifyValues(values);

    // 先清空选择的值 再进行选择
    const selectedList: T[] = [];
    const unSelectedList: T[] = [];

    values.forEach(value => {
      if (this.isSelected(value)) {
        selectedList.push(value);
      } else {
        unSelectedList.push(value);
      }
    });

    selectedList.forEach(value => this.unMarkSelected(value));
    unSelectedList.forEach(value => this.markSelected(value));

    this.emitChange();
  }

  select(...values: T[]): void {
    this.verifyValues(values);
    values.forEach(value => this.markSelected(value));
    this.emitChange();
  }

  unselect(...values: T[]): void {
    this.verifyValues(values);
    values.forEach(value => this.unMarkSelected(value));
    this.emitChange();
  }

  clear(): void {
    this.unMarkAll();
    this.emitChange();
  }

  private verifyValues(values: T[]): void {
    if (values.length > 1 && !this.multiple && process.env.NODE_ENV !== 'production') {
      throw new Error('单选模式下不允许传入多个选择值');
    }
  }

  private emitChange() {
    if (this.selectedEmit.length || this.unselectedEmit.length) {
      this.listeners.forEach(fn =>
        fn({
          values: this.selected,
          added: this.selectedEmit,
          removed: this.unselectedEmit,
        })
      );
    }
    this.selectedEmit = [];
    this.unselectedEmit = [];
    this._selected = null;
  }

  private markSelected(value: T): void {
    if (this.isSelected(value)) {
      return undefined;
    }

    if (!this.multiple) {
      this.unMarkAll();
    }

    if (this.exceeded) {
      return undefined;
    }

    this.selection.add(value);

    this.selectedEmit.push(value);
    return this.calcExceeded();
  }

  private unMarkAll(): void {
    if (!this.isEmpty()) {
      this.selection.forEach(value => this.unMarkSelected(value));
    }
  }

  private unMarkSelected(value: T): void {
    if (this.isSelected(value)) {
      this.selection.delete(value);
      this.unselectedEmit.push(value);
      this.calcExceeded();
    }
  }

  private calcExceeded(): void {
    // 单选情况下不需要进行处理
    if (this.multiple) {
      this._exceeded.value = this.size >= this.limit;
    }
  }
}
