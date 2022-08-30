import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { Ref } from '@wakeadmin/demi';

import { normalizeClassName } from '../utils';

import { FatTableColumn } from './types';
import { FatForm, FatFormItem, FatFormMethods } from '../fat-form';

export const Query = declareComponent({
  name: 'FatTableQuery',
  props: declareProps<{
    loading: boolean;
    formProps: any;
    initialValue: any;
    columns: FatTableColumn<any>[];
    query: () => Ref<any>;
    formRef?: () => Ref<FatFormMethods<any> | undefined>;
  }>(['loading', 'query', 'formProps', 'initialValue', 'columns', 'formRef']),
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
    const submit = async () => ctx.emit('submit');
    const reset = () => ctx.emit('reset');

    return () => {
      const query = props.query().value;
      const scope = { query };

      return (
        <div class="fat-table__query">
          <FatForm
            ref={props.formRef?.()}
            _values={props.query}
            loading={props.loading}
            initialValue={props.initialValue}
            layout="inline"
            renderSubmitter={(form, buttons) => {
              return [ctx.slots.beforeButtons?.(scope), buttons(), ctx.slots.afterButtons?.(scope)];
            }}
            submit={submit}
            onReset={reset}
            {...props.formProps}
          >
            {ctx.slots.before?.(scope)}
            {props.columns
              ?.filter(column => {
                return column.type === 'query' || column.queryable;
              })
              .sort((i, j) => (i.order ?? 1000) - (j.order ?? 1000))
              .map((column, index) => {
                if (column.renderFormItem) {
                  // 自定义渲染
                  return column.renderFormItem(query, column);
                }

                const prop = (typeof column.queryable === 'string' ? column.queryable : column.prop) as string;
                const key = `${prop}_${index}`;

                return (
                  <FatFormItem
                    key={key}
                    prop={prop}
                    label={column.label}
                    renderLabel={column.renderLabel ? () => column.renderLabel!(index, column) : undefined}
                    disabled={column.disabled}
                    tooltip={column.tooltip}
                    initialValue={column.initialValue}
                    valueType={column.valueType}
                    valueProps={{ ...column.valueProps, scene: 'table' }}
                    {...column.formItemProps}
                    class={normalizeClassName(
                      column.type === 'query' ? column.className : undefined,
                      column.formItemProps?.atomicClassName
                    )}
                  />
                );
              })}
          </FatForm>
        </div>
      );
    };
  },
});
