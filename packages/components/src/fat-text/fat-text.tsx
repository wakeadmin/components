import { computed, CSSProperties, HTMLAttributes, ref, watch, onUpdated, onMounted, nextTick } from '@wakeadmin/demi';
import { declareComponent, declareProps } from '@wakeadmin/h';
import { Tooltip, Message } from '@wakeadmin/element-adapter';
import { Copy } from '@wakeadmin/icons';
import { debounce } from '@wakeadmin/utils';
import copy from 'copy-to-clipboard';

import { FatIcon } from '../fat-icon';
import { Color, inheritProps, normalizeClassName, normalizeColor, normalizeStyle } from '../utils';
import { useT } from '../hooks';

export interface FatTextOwnProps {
  /**
   * 颜色
   */
  color?: Color;

  /**
   * 是否显示下划线，默认为 false
   */
  underline?: boolean;

  /**
   * 是否开启溢出显示省略, 默认为 false
   */
  ellipsis?: boolean | number;

  /**
   * 是否可拷贝，默认为 false
   * 如果类型为 string，则拷贝 copyable 指定的内容
   */
  copyable?: boolean | string;

  /**
   * 节点类型
   */
  tag?: any;

  // TODO: expand
}

export interface FatTextProps extends Omit<HTMLAttributes, 'color'>, FatTextOwnProps {}

export const FatText = declareComponent({
  name: 'FatText',
  props: declareProps<FatTextProps>({
    ellipsis: { type: [Number, Boolean] },
    copyable: { type: [Boolean, String] },
    underline: Boolean,
    tag: null,
    color: null,
  }),
  setup(props, { slots, attrs }) {
    const textRef = ref<HTMLAttributes>();
    const measureRef = ref<HTMLAttributes>();
    const width = ref(0);
    const isEllipsis = ref(false);
    const textContent = ref('');
    const t = useT();

    const measureStyle = computed<CSSProperties>(() => ({
      position: 'fixed',
      display: 'block',
      left: '0px',
      top: '0px',
      zIndex: -9999,
      visibility: 'hidden',
      pointerEvents: 'none',
      margin: '0px',
      padding: '0px',
      whiteSpace: 'normal',
      width: width.value + 'px',
    }));

    const style = computed(() => {
      const s: CSSProperties = {};

      if (props.ellipsis) {
        Object.assign(s, {
          WebkitLineClamp: typeof props.ellipsis !== 'number' ? 1 : props.ellipsis,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          display: '-webkit-box',
        });
      }

      if (props.color) {
        s.color = normalizeColor(props.color);
      }

      if (props.underline) {
        s.textDecoration = 'underline';
      }

      return normalizeStyle(s, attrs.style);
    });

    watch(
      () =>
        [!!props.ellipsis, textRef.value, measureRef.value] as [
          boolean,
          HTMLElement | undefined,
          HTMLElement | undefined
        ],
      ([ellipsisEnabled, textInstance, measureInstance], _, cleanup) => {
        if (ellipsisEnabled && textInstance && measureInstance) {
          const handleChange = debounce(() => {
            if (
              measureInstance.offsetWidth === textInstance.offsetWidth &&
              measureInstance.offsetHeight > textInstance.offsetHeight
            ) {
              isEllipsis.value = true;
            } else {
              isEllipsis.value = false;
            }
          }, 500);

          // 监听 textInstance 的大小
          const obs = new ResizeObserver(entries => {
            for (const entry of entries) {
              if (entry.target === textInstance) {
                width.value = textInstance.offsetWidth;
                textContent.value = entry.target.textContent ?? '';
              }

              handleChange();
            }
          });

          obs.observe(textInstance);
          obs.observe(measureInstance);

          cleanup(() => {
            obs.disconnect();
          });
        }
      },
      { flush: 'post', immediate: true }
    );

    onMounted(() => {
      if (textRef.value) {
        textContent.value = textRef.value.textContent ?? '';
      }
    });

    onUpdated(() => {
      if (textRef.value) {
        const nextTextContent = textRef.value.textContent ?? '';
        if (textContent.value !== nextTextContent) {
          nextTick(() => {
            textContent.value = nextTextContent;
          });
        }
      }
    });

    const handleCopy = (evt: MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();

      let content = typeof props.copyable === 'string' ? props.copyable : textContent.value;

      copy(content);
      Message.success(t('wkc.copied'));
    };

    return () => {
      const { tag = 'span', ellipsis, copyable, color, underline, ...other } = props;
      const Tag = tag as 'span';

      const children = slots.default?.();

      return (
        <Tag
          {...inheritProps()}
          {...other}
          ref={textRef}
          class={normalizeClassName('fat-text', attrs.class, {
            'fat-text--ellipsis': isEllipsis.value,
            'fat-text--copyable': copyable,
          })}
          style={style.value}
          title={isEllipsis.value ? textContent.value : undefined}
        >
          {children}

          {!!copyable && (
            <Tooltip v-slots={{ content: t('wkc.copy') }}>
              <FatIcon class="fat-text__copy" onClick={handleCopy}>
                <Copy />
              </FatIcon>
            </Tooltip>
          )}

          {!!ellipsis && (
            <div ref={measureRef} style={measureStyle.value}>
              {children}
            </div>
          )}
        </Tag>
      );
    };
  },
});
