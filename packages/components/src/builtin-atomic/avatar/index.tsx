import { computed, unref } from '@wakeadmin/demi';
import { NoopObject } from '@wakeadmin/utils';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { normalizeClassName, XOR } from '../../utils';
import { ImageObjectFit } from '../images';

export type AAvatarValue =
  | {
      /**
       * 头像链接
       */
      avatar: string;

      /**
       * 标题
       *
       * 可以传入jsx对象
       */
      title?: any;

      /**
       * 描述
       *
       * 可以传入jsx对象
       */
      description?: any;
    }
  | string;

export type AAvatarProps = DefineAtomicProps<
  AAvatarValue,
  {},
  {
    /**
     * 头像显示位置 默认为`left`
     */
    placement?: 'top' | 'left' | 'right' | 'bottom';

    /**
     * 头像的形状
     *
     * 默认为`circle`
     */
    shape?: 'square' | 'circle' | 'rect';

    /**
     * 头像如何适应容器框
     *
     * 默认为 `cover`
     */
    fit?: ImageObjectFit;

    /**
     * 自定义渲染用户信息
     */
    renderInfo?: (prop: AAvatarProps) => any;

    /**
     * 未定义时的占位符
     */
    undefinedPlaceholder?: any;
  } & XOR<
    {
      /**
       * 头像大小
       *
       * 默认为48px
       */
      size?: string;
    },
    {
      /**
       * 头像宽
       *
       */
      width?: string;
      /**
       * 头像高
       *
       */
      height?: string;
    }
  >
>;

declare global {
  interface AtomicProps {
    avatar: AAvatarProps;
  }
}

export const AAvatarComponent = defineAtomicComponent(
  (props: AAvatarProps) => {
    const value = computed<Exclude<AAvatarValue, String>>(() => {
      if (typeof props.value === 'string') {
        return { avatar: props.value };
      }
      return props.value || (NoopObject as any);
    });

    const needRenderInfo = computed(() => {
      const { title, description } = value.value;
      return !!(props.renderInfo ?? description ?? title);
    });

    const configurable = useFatConfigurable();

    const sizes = computed(() => {
      if (props.width) {
        return {
          w: props.width,
          h: props.height!,
        };
      }
      const s = props.size || '48px';
      return {
        w: s,
        h: s,
      };
    });

    return () => {
      const {
        fit = 'cover',
        placement = 'left',
        shape = 'circle',
        // 下面的变量不要 剔除掉
        'v-slots': _vSlots,
        renderInfo: _renderInfo,
        onChange: _onChange,
        value: _value,
        size: _size,
        context: _context,
        undefinedPlaceholder,
        ...other
      } = props;

      const { avatar, title, description } = unref(value);
      const { w, h } = unref(sizes);

      if (!avatar) {
        return undefinedPlaceholder ?? configurable.undefinedPlaceholder;
      }

      const renderInfo = () => {
        if (props.renderInfo) {
          return <div class="fat-a-avatar__info">{props.renderInfo(props)}</div>;
        }

        return (
          <div class="fat-a-avatar__info fat-a-avatar__info--default">
            {title && (
              <span
                key="fat-avatar-title"
                class="fat-a-avatar__info-title"
                title={typeof title === 'object' ? '' : title}
              >
                {title}
              </span>
            )}
            {description && (
              <span
                key="fat-avatar-description"
                class="fat-a-avatar__info-description"
                title={typeof description === 'object' ? '' : description}
              >
                {description}
              </span>
            )}
          </div>
        );
      };

      return (
        <div
          {...other}
          class={normalizeClassName(
            'fat-a-avatar',
            other.class,
            `fat-a-avatar--${shape}`,
            `fat-a-avatar--placement-${placement}`
          )}
        >
          <picture
            class="fat-a-avatar__avatar"
            style={{
              width: w,
              height: h,
            }}
          >
            <img
              style={{
                objectFit: fit,
              }}
              class="fat-a-avatar__avatar-img"
              src={avatar}
              alt={title}
              // @ts-expect-error
              loading="lazy"
            ></img>
          </picture>
          {needRenderInfo.value && renderInfo()}
        </div>
      );
    };
  },
  { name: 'AAvatar', globalConfigKey: 'aAvatarProps' }
);

export const AAvatar = defineAtomic({
  name: 'avatar',
  component: AAvatarComponent,
  description: '头像信息显示',
  author: 'Hallz',
  previewOnly: true,
});
