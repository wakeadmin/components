import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { Form, FormItem, Button, FormMethods } from '@wakeadmin/component-adapter';
import { get, set as _set } from '@wakeadmin/utils';
import { Ref } from '@wakeadmin/demi';

import { useAtomicRegistry } from '../hooks';
import { AtomicCommonProps } from '../atomic';

import { composeAtomProps, getAtom } from './utils';
import { FatTableColumn } from './types';

export const Query = declareComponent({
  name: 'FatTableQuery',
  props: declareProps<{
    loading: boolean;
    query: any;
    formProps: any;
    columns: FatTableColumn<any>[];
    enableSearchButton?: boolean;
    enableResetButton?: boolean;
    searchText?: string;
    resetText?: string;
    formRef?: () => Ref<FormMethods | undefined>;
  }>([
    'loading',
    'query',
    'formProps',
    'columns',
    'enableSearchButton',
    'enableResetButton',
    'searchText',
    'resetText',
    'formRef',
  ]),
  emits: declareEmits<{
    submit: () => void;
    reset: () => void;
  }>(),
  slots: declareSlots<{
    before: { query: any };
    beforeButtons: { query: any };
    afterButtons: { query: any };
  }>(),
  setup(props, ctx) {
    const atomics = useAtomicRegistry();

    const submit = () => ctx.emit('submit');
    const reset = () => ctx.emit('reset');

    return () => {
      const query = props.query;
      const scope = { query };
      return (
        <div class="fat-table__query">
          <Form ref={props.formRef?.()} model={query} inline disabled={props.loading} {...props.formProps}>
            {ctx.slots.before?.(scope)}
            {props.columns?.map((column, index) => {
              if (column.type !== 'query' && !column.queryable) {
                return null;
              }

              const prop = (typeof column.queryable === 'string' ? column.queryable : column.prop) as string;
              const key = `${prop}_${index}`;
              const { comp, validate } = getAtom(column, atomics);
              const rules = column.formItemProps?.rules ?? [];

              const atomProps = composeAtomProps(
                {
                  mode: 'editable',
                  disabled: column.disabled,
                  scene: 'table',
                  value: get(query, prop),
                  onChange: value => {
                    _set(query, prop, value);
                  },
                  context: query,
                } as AtomicCommonProps<any>,
                column.valueProps
              );

              // 原件内置的验证规则
              if (validate) {
                // 验证
                rules.push(async (rule: any, value: any, callback: any) => {
                  try {
                    await validate(value, atomProps, query);
                    callback();
                  } catch (err) {
                    callback(err);
                  }
                });
              }

              return (
                <FormItem
                  key={key}
                  prop={prop}
                  label={column.label}
                  {...column.formItemProps}
                  v-slots={
                    column.renderLabel
                      ? {
                          label: () => {
                            return column.renderLabel?.(index, column);
                          },
                        }
                      : undefined
                  }
                  rules={rules}
                >
                  {comp(atomProps)}
                </FormItem>
              );
            })}
            {ctx.slots.beforeButtons?.(scope)}
            {(!!props.enableSearchButton || !!props.enableResetButton) && (
              <FormItem>
                {!!props.enableSearchButton && (
                  <Button type="primary" onClick={submit}>
                    {props.searchText ?? '搜索'}
                  </Button>
                )}
                {!!props.enableResetButton && <Button onClick={reset}>{props.resetText ?? '重置'}</Button>}
              </FormItem>
            )}
            {ctx.slots.afterButtons?.(scope)}
          </Form>
        </div>
      );
    };
  },
});
