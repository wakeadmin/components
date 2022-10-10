import { computed } from '@wakeadmin/demi';
import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { normalizeClassName } from '../../utils';
import { ImageObjectFit } from '../images';

export interface AAvatarValue {
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
    shape?: 'square' | 'circle';

    /**
     * 头像如何适应容器框
     *
     * 默认为 `cover`
     */
    fit?: ImageObjectFit;

    /**
     * 头像大小
     *
     * 默认为48px
     */
    size?: string;

    /**
     * 自定义渲染用户信息
     */
    renderInfo?: (prop: AAvatarProps) => any;
  }
>;

declare global {
  interface AtomicProps {
    avatar: AAvatarProps;
  }
}

export const AAvatarComponent = defineAtomicComponent(
  (props: AAvatarProps) => {
    const needRenderInfo = computed(() => {
      const { title, description } = props.value || {};
      return !!(props.renderInfo ?? description ?? title);
    });

    const configurable = useFatConfigurable();

    return () => {
      const {
        value,
        fit = 'cover',
        placement = 'left',
        size = '48px',
        shape = 'circle',
        // 下面三个变量不要
        'v-slots': _,
        onChange: __,
        context: ___,
        ...other
      } = props;

      if (!value) {
        return configurable.undefinedPlaceholder;
      }

      const renderInfo = () => {
        if (props.renderInfo) {
          return <div class="fat-a-avatar__info">{props.renderInfo(props)}</div>;
        }

        return (
          <div class="fat-a-avatar__info fat-a-avatar__info--default">
            {value?.title && (
              <span
                key="fat-avatar-title"
                class="fat-a-avatar__info-title"
                title={typeof value.title === 'object' ? '' : value.title}
              >
                {value.title}
              </span>
            )}
            {value?.description && (
              <span
                key="fat-avatar-description"
                class="fat-a-avatar__info-description"
                title={typeof value.description === 'object' ? '' : value.description}
              >
                {value.description}
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
              width: size,
              height: size,
            }}
          >
            <img
              style={{
                objectFit: fit,
              }}
              class="fat-a-avatar__avatar-img"
              src={value.avatar}
              alt={value.title}
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
