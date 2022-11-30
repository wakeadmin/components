import { AnchorHTMLAttributes } from '@wakeadmin/demi';
import { declareComponent, declareProps } from '@wakeadmin/h';

import { RouteLocation, useRouter } from '../hooks';
import { inheritProps, normalizeClassName } from '../utils';
import { FatText, FatTextOwnProps } from './fat-text';

export interface FatLinkOwnProps extends Omit<FatTextOwnProps, 'tag'> {
  href?: RouteLocation;
  /**
   * 导航拦截，支持自定义
   * @param href 用户参数值
   * @param defaultHandler 默认行为, 如果是 http 链接就调用 window.open 或者 window.location.href 跳转，其余清除使用 router.push 跳转
   */
  beforeNavigate?: (href: RouteLocation, defaultHandler: () => void) => void;
}

export interface FatLinkProps extends FatLinkOwnProps, Omit<AnchorHTMLAttributes, 'href' | 'color'> {}

export const FatLink = declareComponent({
  name: 'FatLink',
  props: declareProps<FatLinkProps>({
    href: null,
    target: null,
    beforeNavigate: null,
  }),
  setup(props, { slots, attrs, emit }) {
    const router = useRouter();

    const handleClick = (evt: MouseEvent) => {
      emit('click', evt);

      evt.preventDefault();
      evt.stopPropagation();

      if (!props.href) {
        return;
      }

      const defaultHandler = () => {
        if (typeof props.href === 'string' && props.href.startsWith('http')) {
          if (props.target === '_blank') {
            window.open(props.href);
          } else {
            window.location.href = props.href;
          }
        } else {
          router?.push(props.href!);
        }
      };

      if (props.beforeNavigate) {
        props.beforeNavigate(props.href, defaultHandler);
        return;
      }

      defaultHandler();
    };

    return () => {
      return (
        <FatText
          tag="a"
          color="info"
          underline
          {...inheritProps(false)}
          class={normalizeClassName('fat-link', attrs.class)}
          href={typeof props.href === 'string' ? props.href : undefined}
          onClick={handleClick}
          v-slots={slots}
        />
      );
    };
  },
});
