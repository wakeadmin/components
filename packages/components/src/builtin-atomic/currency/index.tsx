import { InputNumberProps, InputNumber, model } from '@wakeadmin/element-adapter';
import { computed } from '@wakeadmin/demi';
import { decimalDiv, formatMoney } from '@wakeadmin/utils';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { normalizeClassName, toFloat } from '../../utils';

export type ACurrencyProps = DefineAtomicProps<
  number,
  InputNumberProps,
  {
    renderPreview?: (value?: number) => any;

    /**
     * 小数点精度, 默认为 2
     */
    precision?: number;

    /**
     * 货币符号，默认为 ￥
     */
    symbol?: string;

    /**
     * 展示格式，支持以下两种占位符
     * %s symbol 货币符号
     * %v 数字值
     *
     * 默认为 '%s%v'
     */
    format?: string;

    /**
     * 小数点，默认 为 '.'
     *
     * @warning 仅在预览模式有效
     */
    decimal?: string;

    /**
     * 千分位，默认为 ','
     *
     * @warning 仅在预览模式有效
     */
    thousand?: string;

    /**
     * 数字分组大小，默认为 3，即按照千分位
     *
     * @warning 仅在预览模式有效
     */
    grouping?: number;

    /**
     * 分母, 比如传入的是分，那么可以将分母设置为 100
     *
     * @warning 仅在预览模式有效
     */
    denominator?: number;
  }
>;

declare global {
  interface AtomicProps {
    currency: ACurrencyProps;
  }
}

const DEFAULT_SYMBOL = '￥';
const DEFAULT_FORMAT = '%s %v';
const DEFAULT_PRECISION = 2;

export const ACurrencyComponent = defineAtomicComponent(
  (props: ACurrencyProps) => {
    const configurable = useFatConfigurable();
    const valueInFloat = computed(() => toFloat(props.value));

    // 用于预览
    const valueFormatted = computed(() => {
      if (props.mode !== 'preview' || valueInFloat.value == null) {
        return undefined;
      }

      let value = valueInFloat.value;
      if (props.denominator) {
        value = decimalDiv(value, props.denominator);
      }

      return formatMoney(
        value,
        props.symbol ?? DEFAULT_SYMBOL,
        props.precision ?? DEFAULT_PRECISION,
        props.thousand,
        props.decimal,
        props.format ?? DEFAULT_FORMAT
      );
    });

    // 根据 format 计算前缀和后缀
    const prefixAndSuffix = computed(() => {
      const [prefix, suffix] = (props.format ?? DEFAULT_FORMAT).split('%v');

      const replaceSymbol = (value: string | undefined) => {
        if (!value) {
          return '';
        }

        return value.replace('%s', props.symbol ?? DEFAULT_SYMBOL);
      };

      return {
        prefix: replaceSymbol(prefix),
        suffix: replaceSymbol(suffix),
      };
    });

    return () => {
      const {
        value: _value,
        mode,
        onChange,
        renderPreview,
        scene,
        context,
        precision = DEFAULT_PRECISION,
        // ignore
        denominator,
        symbol,
        thousand,
        decimal,
        format,
        class: className,
        style,
        ...other
      } = props;
      const value = valueInFloat.value;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        }

        return (
          <span class={className} style={style}>
            {valueFormatted.value ?? configurable.undefinedPlaceholder}
          </span>
        );
      }

      const { prefix, suffix } = prefixAndSuffix.value;

      return (
        <span class={normalizeClassName('fat-a-currency', className)} style={style}>
          {prefix}
          <InputNumber controlsPosition="right" precision={precision} {...other} {...model(value, onChange!)} />
          {suffix}
        </span>
      );
    };
  },
  { name: 'ACurrency', globalConfigKey: 'aCurrencyProps' }
);

export const ACurrency = defineAtomic({
  name: 'currency',
  component: ACurrencyComponent,
  description: '货币输入',
  author: 'ivan-lee',
});
