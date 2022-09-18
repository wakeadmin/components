import { declareComponent, declareProps } from '@wakeadmin/h';
import { computed } from '@wakeadmin/demi';
import { NoopArray } from '@wakeadmin/utils';
import { Button, MessageBox } from '@wakeadmin/element-adapter';

import { FatTableBatchAction, FatTableMethods } from './types';
import { createMessageBoxOptions, normalizeClassName } from '../utils';

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
    const actions = computed(() => {
      return (typeof props.actions === 'function' ? props.actions(props.tableInstance) : props.actions) ?? NoopArray;
    });

    const selected = computed(() => {
      return !!props.tableInstance.selected.length;
    });

    return () => {
      return (
        <div class="fat-table__batch-actions">
          {slots.default?.()}
          {actions.value.map(i => {
            if (i.visible === false) {
              return null;
            }

            const disabled = i.disabled || (i.disabledUnselected ?? true ? !selected.value : undefined);

            const handleClick = async () => {
              if (i.confirm) {
                const options = createMessageBoxOptions(
                  i.confirm,
                  { title: '提示', showCancelButton: true, type: 'warning', message: '提示消息' },
                  { table: props.tableInstance }
                );
                if (options) {
                  try {
                    await MessageBox(options);
                  } catch {
                    return;
                  }
                }
              }

              i.onClick?.(props.tableInstance);
            };

            return (
              <Button
                key={i.name}
                disabled={disabled}
                class={normalizeClassName('fat-table__batch-action', i.className)}
                style={i.style}
                // @ts-expect-error
                title={i.title}
                onClick={handleClick}
                {...i.buttonProps}
              >
                {i.name}
              </Button>
            );
          })}
        </div>
      );
    };
  },
});
