/**
 * 浮动 footer
 */
import { declareComponent } from '@wakeadmin/h';
import { Disposer } from '@wakeadmin/utils';
import { ref, onMounted } from '@wakeadmin/demi';

export const FatFloatFooter = declareComponent({
  name: 'FatFloatFooter',
  setup(_, { slots, attrs }) {
    const disposer = new Disposer();
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

    return () => (
      <div class={attrs.class} style={attrs.style}>
        <footer part="body" class="fat-float-footer" style={{ left: left.value }}>
          {slots.default?.()}
        </footer>
        <div class="fat-float-footer__placeholder"></div>
        <div class="fat-float-footer__watcher" ref={elRef}></div>
      </div>
    );
  },
});
