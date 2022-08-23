/**
 * element-ui 使用 1.8.5 版本
 * element-plus 使用 4.x 版本
 * 功能上基本兼容
 */

// >>>>> Rule
// Modified from https://github.com/yiminghe/async-validator/blob/0d51d60086a127b21db76f44dff28ae18c165c47/src/index.d.ts
export type RuleType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'method'
  | 'regexp'
  | 'integer'
  | 'float'
  | 'array'
  | 'object'
  | 'enum'
  | 'date'
  | 'url'
  | 'hex'
  | 'email';

export interface ValidateOption {
  // when the first validation rule generates an error stop processed
  first?: boolean;

  // when the first validation rule of the specified field generates an error stop the field processed, 'true' means all fields.
  firstFields?: boolean | string[];
}

export interface RuleItem {
  type?: RuleType; // default type is 'string'
  required?: boolean;
  pattern?: RegExp | string;
  min?: number; // Range of type 'string' and 'array'
  max?: number; // Range of type 'string' and 'array'
  len?: number; // Length of type 'string' and 'array'
  enum?: (string | number | boolean | null | undefined)[]; // possible values of type 'enum'
  whitespace?: boolean;
  fields?: Record<string, Rule>; // ignore when without required
  options?: ValidateOption;
  defaultField?: Rule; // 'object' or 'array' containing validation rules
  transform?: (value: Value) => Value;
  message?: string | ((a?: string) => string);

  /**
   * 必须调用 callback, 这样可以获取到最好的兼容性, 兼容新旧版本
   */
  validator?: (
    rule: InternalRuleItem,
    value: Value,
    callback: (error?: string | Error) => void,
    source: Values,
    options: ValidateOption
  ) => void;

  // element-ui 扩展
  trigger?: 'blur' | 'change';
}

export type Rule = RuleItem | RuleItem[];

export type Rules = Record<string, Rule>;

/**
 *  Performs validation for any type.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
export type ExecuteValidator = (
  rule: InternalRuleItem,
  value: Value,
  callback: (error?: string[]) => void,
  source: Values,
  options: ValidateOption
) => void;

// >>>>> Values
export type Value = any;
export type Values = Record<string, Value>;

export interface InternalRuleItem extends Omit<RuleItem, 'validator'> {
  field?: string;
  fullField?: string;
  fullFields?: string[];
  validator?: RuleItem['validator'] | ExecuteValidator;
}
