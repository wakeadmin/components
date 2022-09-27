/**
 * 浮动 footer
 */
import { declareComponent, declareProps } from '@wakeadmin/h';
import { Disposer } from '@wakeadmin/utils';
import { ref, onMounted } from '@wakeadmin/demi';

import { isWakeadminBayEnabled } from './utils';

export interface FatFloatFooterProps {
  /**
   * 在微前端环境是否直接使用基座提供的 wkc-header，默认 true
   */
  useWakeadminHeaderIfNeed?: boolean;
}

export const FatFloatFooter = declareComponent({
  name: 'FatFloatFooter',
  props: declareProps<FatFloatFooterProps>({
    useWakeadminHeaderIfNeed: { type: Boolean, default: true },
  }),
  setup(props, { slots, attrs }) {
    const disposer = new Disposer();
    const wakeadminBayEnabled = isWakeadminBayEnabled();
    const left = ref<string | number>(0);
    const elRef = ref<HTMLDivElement>();

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
      if (wakeadminBayEnabled && props.useWakeadminHeaderIfNeed) {
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
