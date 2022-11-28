import { TabPane } from '@wakeadmin/element-adapter';
import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { Noop } from '@wakeadmin/utils';
import { onBeforeUnmount, shallowReactive } from '@wakeadmin/demi';

import { FatFormCollectionProvider } from '../../fat-form/fat-form-collection';
import { FatFormCollection, FatFormCollectionItem } from '../../fat-form/types';

import { inheritProps, ToHSlotDefinition } from '../../utils';
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

    const instance: FatFormTabPaneMethods = shallowReactive({
      name: props.name,
      async validate() {
        await Promise.all(items.map(i => i.validate()));
      },
      renderResult: null,
    });

    const disposer = parent?.register(instance);

    if (disposer) {
      onBeforeUnmount(disposer);
    }

    return () => {
      instance.renderResult = (
        <TabPane
          key={props.name}
          {...inheritProps(false)}
          name={props.name}
          class={`fat-form-tabs__tab-pane--${props.name}`}
          v-slots={{ label: slots.label?.() }}
        >
          <FatFormCollectionProvider value={collection}>
            <div>{slots.default?.()}</div>
          </FatFormCollectionProvider>
        </TabPane>
      );

      return null;
    };
  },
});
