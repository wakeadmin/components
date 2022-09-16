import { AnchorHTMLAttributes } from '@wakeadmin/demi';
import { declareComponent, declareProps } from '@wakeadmin/h';

import { RouteLocation, useRouter } from '../hooks';
import { inheritProps, normalizeClassName } from '../utils';
import { FatText, FatTextOwnProps } from './fat-text';

export interface FatLinkOwnProps extends Omit<FatTextOwnProps, 'tag'> {
  href?: RouteLocation;
}

export interface FatLinkProps extends FatLinkOwnProps, Omit<AnchorHTMLAttributes, 'href' | 'color'> {}

export const FatLink = declareComponent({
  name: 'FatLink',
  props: declareProps<FatLinkProps>({
    href: null,
    target: null,
  }),
  setup(props, { slots, attrs }) {
    const router = useRouter();

    const handleClick = (evt: MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (!props.href) {
        return;
      }

      if (typeof props.href === 'string' && props.href.startsWith('http')) {
        if (props.target === '_blank') {
          window.open(props.href);
        } else {
          window.location.href = props.href;
        }
      } else {
        router?.push(props.href);
      }
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
