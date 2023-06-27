import { Input, InputProps, model } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { FatLink, FatLinkProps, FatTextOwnProps } from '../../fat-text';
import { getI18nInstance } from '../../i18n';
import { isEmpty } from './utils';

export type AUrlProps = DefineAtomicProps<
  string,
  InputProps,
  {
    renderPreview?: (value: any) => any;

    /**
     * 透传 FatLink 的参数
     */
    linkProps?: FatLinkProps;

    /**
     * 未定义时的占位符
     */
    undefinedPlaceholder?: any;
  } & FatTextOwnProps
>;

declare global {
  interface AtomicProps {
    url: AUrlProps;
  }
}

export const AUrlComponent = defineAtomicComponent(
  (props: AUrlProps) => {
    const configurable = useFatConfigurable();

    return () => {
      const {
        value,
        mode,
        onChange,
        renderPreview,
        scene,
        context,
        ellipsis,
        copyable,
        tag,
        linkProps,
        undefinedPlaceholder,
        ...other
      } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        }

        if (isEmpty(value)) {
          return (
            <span class={other.class} style={other.style}>
              {undefinedPlaceholder ?? configurable.undefinedPlaceholder}
            </span>
          );
        }

        return (
          <FatLink class={other.class} style={other.style} copyable={!!value && copyable} href={value} {...linkProps}>
            {String(value)}
          </FatLink>
        );
      }

      return <Input {...other} {...model(value, onChange!)} />;
    };
  },
  { name: 'AUrl', globalConfigKey: 'aUrlProps' }
);

export const AUrl = defineAtomic({
  name: 'url',
  component: AUrlComponent,
  description: '链接',
  author: 'ivan-lee',
  validateTrigger: 'blur',
  async validate(value) {
    if (value && typeof value === 'string') {
      try {
        // eslint-disable-next-line no-new
        new URL(value);
      } catch (err) {
        const i18n = getI18nInstance();
        throw new Error(i18n.t('wkc.enterValidURL'));
      }
    }
  },
});
