/**
 * 浮动 footer
 */
import { declareComponent, declareProps } from '@wakeadmin/h';
import { Disposer } from '@wakeadmin/utils';
import { ref, onMounted, computed } from '@wakeadmin/demi';

import { useFatConfigurable } from '../fat-configurable';
import { isWakeadminBayEnabled } from './utils';

export interface FatFloatFooterProps {
  /**
   * 在微前端环境是否直接使用基座提供的 wkc-float-footer，默认 true
   */
  reuseBayIfNeed?: boolean;
}

export const FatFloatFooter = declareComponent({
  name: 'FatFloatFooter',
  props: declareProps<FatFloatFooterProps>({
    reuseBayIfNeed: { type: Boolean, default: null },
  }),
  setup(props, { slots, attrs }) {
    const disposer = new Disposer();
    const wakeadminBayEnabled = isWakeadminBayEnabled();
    const configurable = useFatConfigurable();
    const left = ref<string | number>(0);
    const elRef = ref<HTMLDivElement>();
    const reuseBayIfNeed = computed(() => props.reuseBayIfNeed ?? configurable.reuseBayIfNeed ?? true);

    onMounted(() => {
      const el = elRef.value;
      if (!el) {
        return;
      }

      const resizeObserver = new ResizeObserver(entries => {
        const entry = entries[0];
        if (entry) {
          left.value = `${el.getBoundingClientRect().left}px`;
        }
      });

      resizeObserver.observe(el);

      disposer.push(() => resizeObserver.disconnect());
    });

    return () => {
      if (wakeadminBayEnabled && reuseBayIfNeed.value) {
        return (
          <wkc-float-footer class={attrs.class} style={attrs.style}>
            {slots.default?.()}
          </wkc-float-footer>
        );
      }

      return (
        <div class={attrs.class} style={attrs.style}>
          <footer part="body" class="fat-float-footer" style={{ left: left.value }}>
            {slots.default?.()}
          </footer>
          <div class="fat-float-footer__placeholder"></div>
          <div class="fat-float-footer__watcher" ref={elRef}></div>
        </div>
      );
    };
  },
});
