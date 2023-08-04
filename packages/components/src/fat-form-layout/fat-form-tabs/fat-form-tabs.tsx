import { Tabs, Button, model, Message } from '@wakeadmin/element-adapter';
import { declareComponent, declareEmits, declareProps } from '@wakeadmin/h';
import { ref, watch, computed, defineComponent } from '@wakeadmin/demi';

import { FatFormPublicMethodKeys } from '../../fat-form/constants';
import { FatForm, useFatFormRef } from '../../fat-form';
import { useFatConfigurable } from '../../fat-configurable';
import {
  forwardExpose,
  hasSlots,
  inheritProps,
  normalizeClassName,
  OurComponentInstance,
  renderSlot,
  ToHEmitDefinition,
} from '../../utils';

import { FatFormTabPaneMethods, FatFormTabsContextValue, provideFatFormTabsContext } from './fat-form-tabs-context';
import { FatFormTabsEvents, FatFormTabsMethods, FatFormTabsProps, FatFormTabsSlots } from './types';
import { useDevtoolsExpose, useT } from '../../hooks';
import { DEFAULT_LAYOUT } from './default-layout';

export const FatFormTabsPublicMethodKeys: (keyof FatFormTabsMethods)[] = [...FatFormPublicMethodKeys];

const FatFormTabsInner = declareComponent({
  name: 'FatFormTabs',
  props: declareProps<FatFormTabsProps<any>>({
    tabsProps: null,
    mode: null,
    initialActive: null,

    // submitter
    enableSubmitter: { type: Boolean, default: undefined },
    enableCancel: { type: Boolean, default: true },
    cancelText: String,
    cancelProps: null,
    submitText: String,
    submitProps: null,
    enableReset: { type: Boolean, default: false },
    resetText: String,
    resetProps: null,
    beforeCancel: null,
    validateErrorCapture: null,

    // layout
    pageLayout: null,
    layoutProps: null,

    // slots
    renderSubmitter: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatFormTabsEvents<any>>>(),
  setup(props, { slots, emit, attrs, expose }) {
    const configurable = useFatConfigurable();
    const tabs: Map<string | number, FatFormTabPaneMethods> = new Map();
    const submitLoading = ref(false);
    const form = useFatFormRef();
    const active = ref<string | number | undefined>(props.initialActive);
    const t = useT();
    const enabledSubmitter = computed(() => {
      return props.enableSubmitter ?? props.mode !== 'preview';
    });

    const submitting = computed(() => {
      return form.value?.submitting || submitLoading.value;
    });

    const context: FatFormTabsContextValue = {
      register(ins) {
        if (tabs.has(ins.name)) {
          throw new Error(`[fat-form-tabs] tab-pane name(${ins.name}) is already registered`);
        }
        tabs.set(ins.name, ins);

        // 初始化默认选择
        if (active.value == null) {
          active.value = ins.name;
        }

        return () => {
          tabs.delete(ins.name);
        };
      },
    };

    const handleActiveChange = (tab?: string | number) => {
      if (tabs.size === 0 || tab === active.value) {
        return;
      }

      active.value = tab;
      emit('activeChange', tab);
    };

    const handleCancel = () => {
      const done = () => {
        if (window.history.length > 1) {
          window.history.back();
        }

        emit('cancel');
      };

      if (props.beforeCancel) {
        props.beforeCancel(done);
      } else {
        done();
      }
    };

    const submit = async () => {
      try {
        submitLoading.value = true;
        // 分 tab 进行验证
        for (const tab of tabs.values()) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await tab.validate();
          } catch (err) {
            if (props.validateErrorCapture) {
              props.validateErrorCapture(tab.name, err as Error);
            } else {
              Message.error(t('wkc.fillForm'));
            }

            handleActiveChange(tab.name);

            return;
          }
        }

        // 所有验证通过，提交
        await form.value?.submit();
      } finally {
        submitLoading.value = false;
      }
    };

    // 监听 initialValue 变动
    watch(
      () => props.initialActive,
      (value, oldValue) => {
        if (value !== oldValue && value !== active.value) {
          active.value = value;
        }
      }
    );

    const renderButtons = () => {
      return [
        !!props.enableCancel && (
          <Button onClick={handleCancel} {...props.cancelProps}>
            {props.cancelText ?? configurable.fatForm?.backText ?? t('wkc.cancel')}
          </Button>
        ),
        !!props.enableReset && props.mode !== 'preview' && (
          <Button onClick={form.value?.reset} {...props.resetProps}>
            {props.resetText ?? configurable.fatForm?.resetText ?? t('wkc.reset')}
          </Button>
        ),
        props.mode !== 'preview' && (
          <Button type="primary" onClick={submit} loading={submitting.value} {...props.submitProps}>
            {props.submitText ?? configurable.fatForm?.saveText ?? t('wkc.save')}
          </Button>
        ),
      ];
    };

    const exposed: FatFormTabsMethods<any> = { submit, renderButtons };

    forwardExpose(exposed as any, FatFormPublicMethodKeys, form);

    expose(exposed);

    const renderSubmitter = computed(() => {
      return enabledSubmitter.value
        ? () => {
            return hasSlots(props, slots, 'submitter') ? (
              renderSlot(props, slots, 'submitter', exposed)
            ) : (
              <div class="fat-form-steps__submitter">{renderButtons()}</div>
            );
          }
        : undefined;
    });

    // 局部渲染优化
    const TabsInner = defineComponent({
      name: 'TabsInner',
      render() {
        return (
          <Tabs
            {...props.tabsProps}
            {...model(active.value, handleActiveChange)}
            class={normalizeClassName('fat-form-tabs__tabs', props.tabsProps?.class)}
          >
            {Array.from(tabs.values()).map(i => {
              return i.renderResult;
            })}
          </Tabs>
        );
      },
    });

    provideFatFormTabsContext(context);

    useDevtoolsExpose({
      active,
    });

    return () => {
      const layout = props.pageLayout ?? DEFAULT_LAYOUT;

      return (
        <FatForm
          {...inheritProps()}
          hierarchyConnect={false}
          ref={form}
          mode={props.mode}
          enableSubmitter={false}
          class={normalizeClassName('fat-form-tabs', attrs.class)}
          style={attrs.style}
        >
          {layout({
            layoutProps: props.layoutProps,
            form: exposed,
            renderSubmitter: renderSubmitter.value,
            renderTabs() {
              return [<TabsInner />, renderSlot(props, slots, 'default')];
            },
          })}
        </FatForm>
      );
    };
  },
});

export function useFatFormTabsRef<Store extends {} = any, Request extends {} = Store, Submit extends {} = Store>() {
  return ref<FatFormTabsMethods<Store, Request, Submit>>();
}

export const FatFormTabs = FatFormTabsInner as unknown as new <
  Store extends {} = any,
  Request extends {} = Store,
  Submit extends {} = Store
>(
  props: FatFormTabsProps<Store, Request, Submit>
) => OurComponentInstance<
  typeof props,
  FatFormTabsSlots<Store>,
  FatFormTabsEvents<Store, Submit>,
  FatFormTabsMethods<Store, Request, Submit>
>;
