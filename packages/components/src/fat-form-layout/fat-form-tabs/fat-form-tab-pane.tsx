import { TabPane } from '@wakeadmin/element-adapter';
import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { Noop } from '@wakeadmin/utils';
import { getCurrentInstance, onBeforeUnmount } from '@wakeadmin/demi';

import { FatFormCollectionProvider } from '../../fat-form/fat-form-collection';
import { FatFormCollection, FatFormCollectionItem } from '../../fat-form/types';

import { inheritProps, pickEnumerable, ToHSlotDefinition } from '../../utils';
import { FatFormTabPaneMethods, useFatFormTabsContext } from './fat-form-tabs-context';

import { FatFormTabPaneProps, FatFormTabPaneSlots } from './types';

export const FatFormTabPane = declareComponent({
  name: 'FatFormTabPane',
  props: declareProps<FatFormTabPaneProps>({
    name: null,
  }),
  slots: declareSlots<ToHSlotDefinition<FatFormTabPaneSlots>>(),
  setup(props, { slots }) {
    if (props.name == null) {
      throw new Error(`[fat-form-tab-pane] name 不能为空`);
    }

    const parent = useFatFormTabsContext();

    // 收集到的所有表单项
    const items: FatFormCollectionItem[] = [];

    const collection: FatFormCollection = {
      registerSection() {
        return Noop;
      },
      registerItem(item) {
        items.push(item);

        return () => {
          const idx = items.indexOf(item);
          if (idx !== -1) {
            items.splice(idx, 1);
          }
        };
      },
    };

    const vm = getCurrentInstance();

    const instance: FatFormTabPaneMethods = {
      name: props.name,
      async validate() {
        await Promise.all(items.map(i => i.validate()));
      },
      render() {
        return (
          <TabPane
            key={props.name}
            {...inheritProps(false, vm?.proxy)}
            name={props.name}
            v-slots={pickEnumerable(slots, 'default')}
          >
            <FatFormCollectionProvider value={collection}>
              <div>{slots.default?.()}</div>
            </FatFormCollectionProvider>
          </TabPane>
        );
      },
    };

    const disposer = parent?.register(instance);

    if (disposer) {
      onBeforeUnmount(disposer);
    }

    return () => {
      return null;
    };
  },
});
