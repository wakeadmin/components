import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { Ref, customRef } from '@wakeadmin/demi';

import { normalizeClassName } from '../utils';

import { FatTableColumn } from './types';
import { FatFormGroup, FatFormItem, FatFormMethods } from '../fat-form';
import { FatFormQuery, FatFormQueryMethods } from '../fat-form-layout';

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
    submitter: { query: any };
    afterButtons: { query: any };
    after: { query: any };
  }>(),
  setup(props, ctx) {
    const submit = async () => ctx.emit('submit');
    const reset = () => ctx.emit('reset');

    let _formRef: FatFormQueryMethods<any> | undefined;
    const formRef = customRef<FatFormQueryMethods<any> | undefined>(() => ({
      get: () => {
        return _formRef;
      },
      set: (value: FatFormQueryMethods<any> | undefined) => {
        _formRef = value;
        const outerRef = props.formRef?.();

        if (outerRef && value) {
          outerRef.value = value;
        }
      },
    }));

    return () => {
      const query = props.query().value;
      const scope = { query };

      return (
        <div class="fat-table__query">
          <FatFormQuery
            ref={formRef}
            getValues={props.query}
            loading={props.loading}
            initialValue={props.initialValue}
            layout="inline"
            submitOnQueryChange={false}
            renderSubmitter={(form, buttons) => {
              return [
                ctx.slots.beforeButtons?.(scope),
                ctx.slots.submitter ? (
                  ctx.slots.submitter?.(scope)
                ) : (
                  <FatFormGroup labelWidth="auto" gutter="sm" col={false}>
                    {buttons()}
                  </FatFormGroup>
                ),
                ctx.slots.afterButtons?.(scope),
              ];
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
                    valueProps={{
                      ...(typeof column.valueProps === 'function' ? column.valueProps() : column.valueProps),
                      scene: 'table',
                    }}
                    valueStyle={column.valueStyle}
                    {...column.formItemProps}
                    class={normalizeClassName(
                      column.type === 'query' ? column.className : undefined,
                      column.valueClassName,
                      column.formItemProps?.class
                    )}
                  />
                );
              })}
            {ctx.slots.after?.(scope)}
          </FatFormQuery>
        </div>
      );
    };
  },
});
