import { Ref, ObjectEmitsOptions } from '@wakeadmin/demi';

export type PickOnEvent<T extends {}> = {
  [K in keyof T as K extends `on${string}` ? K : never]: T[K];
};

/**
 * 选择 _ 开始的属性
 */
export type PickUnderScore<T extends {}> = {
  [K in keyof T as K extends `_${string}` ? K : never]: T[K];
};

/**
 * 忽略掉 _ 开始的属性
 */
export type OmitUnderScore<T extends {}> = Omit<T, keyof PickUnderScore<T>>;

type TrimOnPrefix<K extends string> = K extends `on${infer E}`
  ? E extends `${infer F}${infer L}`
    ? `${Lowercase<F>}${L}`
    : E
  : K;

type TrimRenderPrefix<K extends string> = K extends `render${infer E}`
  ? E extends `${infer F}${infer L}`
    ? `${Lowercase<F>}${L}`
    : E
  : K;

type TrimOnEvents<T extends {}> = {
  [K in keyof T as TrimOnPrefix<string & K>]: T[K];
};

type AddOnPrefix<K extends string> = K extends `on${infer E}`
  ? K
  : K extends `${infer F}${infer L}`
  ? `on${Uppercase<F>}${L}`
  : `on${Uppercase<K>}`;

/**
 * 将事件名称都转换成`onXxxx`格式
 */
export type ToJSXEmitDefinition<T extends {}> = {
  [K in keyof T as AddOnPrefix<K & string>]: T[K];
};
/**
 * 将 on* 类型的事件转换为 h 库的 emit 类型格式
 */
export type ToHEmitDefinition<T> = TrimOnEvents<Required<T>>;

type TrimRenderFunctionAndExtraParam<T extends {}> = {
  [K in keyof T as TrimRenderPrefix<string & K>]: T[K] extends (a: void) => any
    ? never
    : T[K] extends (a: infer R, ...args: any[]) => any
    ? R
    : never;
};

/**
 * 将 render* 类型的渲染函数转换未 h 库的 slot 类型格式
 */
export type ToHSlotDefinition<T> = TrimRenderFunctionAndExtraParam<Required<T>>;

type TransformRenderFunctionToSlotDefinition<T extends {}> = {
  [K in keyof T as TrimRenderPrefix<string & K>]: T[K];
};

/**
 * 将 render* 类型的渲染函数转换为 volar 类型声明
 */
export interface ToVolarSlotDefinition<T extends {}> {
  /**
   * @private Volar 用于推断插槽类型
   */
  $slots: TransformRenderFunctionToSlotDefinition<Required<T>>;
}

type UnionToIntersection<Union> = (Union extends any ? (arg: Union) => void : never) extends (arg: infer I) => void
  ? I
  : never;

/**
 * 将 on* 类型渲染转换为 volar $emit 类型
 */
export interface ToVolarEmitDefinition<
  T extends {},
  // @ts-expect-error
  HEmit extends ObjectEmitsOptions = ToHEmitDefinition<T>,
  Event extends keyof HEmit = keyof HEmit
> {
  $emit: UnionToIntersection<
    {
      [key in Event]: HEmit[key] extends (...args: infer Args) => any
        ? (event: key, ...args: Args) => void
        : (event: key, ...args: any[]) => void;
    }[Event]
  >;
}

/**
 * 自定义组件实例
 */
export interface OurComponentInstance<Props extends {}, Slots extends {}, Events extends {}, Expose = any>
  extends ToVolarSlotDefinition<Slots>,
    ToVolarEmitDefinition<Events> {
  $props: Props & {
    // 兼容 h 的 slots 写法
    'v-slots'?: Partial<TransformRenderFunctionToSlotDefinition<Required<Slots>>>;
    ref?: Ref<Expose | Expose[] | undefined> | string;
  };
}

export type DefineOurComponent<Props extends {}, Slots extends {}, Events extends {}, Expose = any> = new (
  props: Props
) => OurComponentInstance<Props, Slots, Events, Expose>;

/**
 * 获取Set类型里函数的参数
 */
export type GetParameterInSet<S extends Set<any>> = S extends Set<infer F extends (...args: any) => any>
  ? Parameters<F>
  : never;

type Without<T> = { [K in keyof T]?: never };
export type XOR<T, U> = (Without<T> & U) | (Without<U> & T);
