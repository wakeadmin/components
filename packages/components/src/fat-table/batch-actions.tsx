import { declareComponent, declareProps } from '@wakeadmin/h';
import { computed, inject, ref } from '@wakeadmin/demi';
import { NoopArray } from '@wakeadmin/utils';
import { Button, MessageBox, Message } from '@wakeadmin/element-adapter';

import { FatTableBatchAction, FatTableMethods } from './types';
import { createMessageBoxOptions, normalizeClassName } from '../utils';
import { FatTableInstanceContext } from './constants';

const BatchAction = declareComponent({
  name: 'FatBatchAction',
  props: declareProps<{ action: FatTableBatchAction<any, any>; table: FatTableMethods<any, any>; selected: boolean }>([
    'action',
    'table',
    'selected',
  ]),
  setup(props) {
    const _loading = ref(false);

    const handleClick = async () => {
      const { action, table } = props;
      if (action.confirm) {
        const options = createMessageBoxOptions(
          action.confirm,
          { title: '提示', showCancelButton: true, type: 'warning', message: '提示消息' },
          { table }
        );
        if (options) {
          try {
            await MessageBox(options);
          } catch {
            return;
          }
        }
      }

      try {
        _loading.value = true;
        await action.onClick?.(table);
      } catch (err) {
        console.error(err);
        Message.error((err as Error).message);
      } finally {
        _loading.value = false;
      }
    };
    return () => {
      const { action, selected } = props;

      if (action.visible === false) {
        return null;
      }

      const disabledUnselected = action.disabledUnselected ?? true;
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const disabled = action.disabled || (disabledUnselected ? !selected : undefined);
      const loading = _loading.value || action.loading;

      return (
        <Button
          disabled={disabled}
          class={normalizeClassName('fat-table__batch-action', action.className)}
          style={action.style}
          onClick={handleClick}
          loading={loading}
          // @ts-expect-error
          title={action.title}
          {...action.buttonProps}
        >
          {action.name}
        </Button>
      );
    };
  },
});

/**
 * 批量操作按钮
 */
export const BatchActions = declareComponent({
  name: 'FatBatchActions',
  props: declareProps<{
    tableInstance: FatTableMethods<any, any>;
    actions: FatTableBatchAction<any, any>[] | ((table: FatTableMethods<any, any>) => FatTableBatchAction<any, any>[]);
  }>(['tableInstance', 'actions']),
  setup(props, { slots }) {
    const tableInstance = inject(FatTableInstanceContext, props.tableInstance);

    const actions = computed(() => {
      return (typeof props.actions === 'function' ? props.actions(tableInstance) : props.actions) ?? NoopArray;
    });

    const selected = computed(() => {
      return !!tableInstance.selected?.length;
    });

    return () => {
      return (
        <div class="fat-table__batch-actions">
          {slots.default?.()}
          {actions.value.map((i, idx) => {
            return <BatchAction key={idx} action={i} table={tableInstance} selected={selected.value} />;
          })}
        </div>
      );
    };
  },
});
