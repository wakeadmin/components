import { declareComponent, declareEmits, declareProps, withDirectives } from '@wakeadmin/h';
import { computed, onMounted, ref } from '@wakeadmin/demi';
import { Message, vLoading } from '@wakeadmin/element-adapter';
import { Refresh } from '@wakeadmin/icons';

import { FatIcon } from '../fat-icon';
import { ToHEmitDefinition, clamp, normalizeClassName } from '../utils';
import { useT } from '../hooks';

/**
 * 元数据
 */
export interface FatImageVerificationCodeMetadata {
  backgroundImage: string;
  clipImage: string;

  /**
   * y 轴
   */
  y: number;

  /**
   * 其他附加数据，任意
   */
  extra?: any;
}

export interface FatImageVerificationEvents {
  /**
   * 坐标值变动
   * @param value
   * @returns
   */
  onChange?: (event: { value: number; context: FatImageVerificationCodeMetadata }) => void;
}

export interface FatImageVerificationProps extends FatImageVerificationEvents {
  /**
   * 获取获取元数据
   * @returns
   */
  request: () => Promise<FatImageVerificationCodeMetadata>;

  /**
   * 占位符
   */
  placeholder?: any;

  /**
   * 画布配置
   */
  canvas?: {
    /**
     * 默认 350
     */
    width?: number;

    /**
     * 默认 150
     */
    height?: number;
  };

  /**
   * 切片大小配置，默认 undefined，即使用图片的尺寸
   */
  clip?: {
    width?: number;
    height?: number;
  };
}

const DEFAULT_CANVAS_WIDTH = 350;
const DEFAULT_CANVAS_HEIGHT = 150;

export const FatImageVerification = declareComponent({
  props: declareProps<FatImageVerificationProps>(['request', 'placeholder', 'canvas', 'clip']),
  emits: declareEmits<ToHEmitDefinition<FatImageVerificationEvents>>(),

  setup(props, { attrs, emit }) {
    const loading = ref(false);
    const metadata = ref<FatImageVerificationCodeMetadata>();
    const backgroundRef = ref<HTMLDivElement>();
    const clipElementRef = ref<HTMLImageElement>();
    const translate = ref(0);
    const t = useT();

    const requestMetadata = async () => {
      try {
        loading.value = true;
        translate.value = 0;

        metadata.value = await props.request();
      } catch (error) {
        console.error(error);
        Message.error((error as Error).message);
      } finally {
        loading.value = false;
      }
    };

    const rootStyle = computed(() => {
      return {
        width: `${props.canvas?.width ?? DEFAULT_CANVAS_WIDTH}px`,
        ...(attrs.style as any),
      };
    });

    const backgroundStyle = computed(() => {
      return {
        height: `${props.canvas?.height ?? DEFAULT_CANVAS_HEIGHT}px`,
      };
    });

    const clipStyle = computed(() => {
      return {
        width: props.clip?.width ? `${props.clip?.width}px` : undefined,
        height: props.clip?.height ? `${props.clip?.height}px` : undefined,
        transform: `translate(${translate.value}px, ${metadata.value?.y ?? 0}px)`,
      };
    });

    const progressStyle = computed(() => {
      return {
        width: `${translate.value}px`,
      };
    });

    const handleStartDrag = (e: MouseEvent) => {
      let dragging = true;
      const current = translate.value;
      const start = e.pageX;
      const backgroundWidth = backgroundRef.value?.offsetWidth ?? 350;
      const clipWidth = clipElementRef.value?.offsetWidth ?? 35;
      const min = 0;
      const max = backgroundWidth - clipWidth;

      const handleMove = (evt: MouseEvent) => {
        if (!dragging) {
          return;
        }
        const delta = evt.pageX - start;
        const offset = clamp(current + delta, min, max);

        translate.value = offset;
      };

      const handleUp = (evt: MouseEvent) => {
        if (!dragging) {
          return;
        }

        dragging = false;

        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
        document.removeEventListener('mouseleave', handleUp);

        emit('change', { value: translate.value, context: metadata.value! });
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
      document.addEventListener('mouseleave', handleUp);
    };

    const handleRefresh = () => {
      requestMetadata();
    };

    onMounted(() => {
      requestMetadata();
    });

    return () => {
      return (
        <div
          class={normalizeClassName('fat-image-verify-code', attrs.class)}
          style={rootStyle.value}
          {...withDirectives([[vLoading, loading.value]])}
        >
          <main class="fat-image-verify-code__bg" style={backgroundStyle.value} ref={backgroundRef}>
            {metadata.value?.backgroundImage && (
              <img src={metadata.value?.backgroundImage} alt="background" draggable={false} />
            )}
          </main>
          {metadata.value?.clipImage && (
            <img
              src={metadata.value.clipImage}
              alt="clip"
              style={clipStyle.value}
              class="fat-image-verify-code__clip"
              draggable={false}
              onMousedown={handleStartDrag}
              ref={clipElementRef}
            ></img>
          )}
          <FatIcon class="fat-image-verify-code__refresh" onClick={handleRefresh} title={t('wkc.refresh')}>
            <Refresh />
          </FatIcon>
          <footer class="fat-image-verify-code__slider">
            <div class="fat-image-verify-code__slider-control">
              <div class="fat-image-verify-code__slider-progress" style={progressStyle.value}></div>
              <div class="fat-image-verify-code__slider-bar" onMousedown={handleStartDrag}></div>
            </div>
            <div class="fat-image-verify-code__slider-placeholder">
              {props.placeholder ?? t('wkc.imageVerificationPlaceholder')}
            </div>
          </footer>
        </div>
      );
    };
  },
});
