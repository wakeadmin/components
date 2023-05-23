import { DatePicker, DatePickerProps, model } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { formatDate } from '../../utils';
import { getOrCreatePlaceholder } from '../../utils/placeholder';

export type ADateValue = string | Date | number;
export type ADateProps = DefineAtomicProps<
  ADateValue,
  DatePickerProps,
  {
    /**
     * 预览时日期格式，默认同 format
     */
    previewFormat?: string;

    /**
     * 自定义预览
     */
    renderPreview?: (value: ADateValue) => any;
  }
>;

export const ADateComponent = defineAtomicComponent(
  (props: ADateProps) => {
    const configurable = useFatConfigurable();
    const preview = (value: any, format: string) => {
      if (props.renderPreview) {
        return props.renderPreview(value);
      }

      if (value == null) {
        return configurable.undefinedPlaceholder;
      }

      return formatDate(value, format);
    };

    return () => {
      let { value, mode, onChange, previewFormat, scene, context, placeholder, ...other } = props;

      previewFormat ??= other.format ?? configurable.dateFormat ?? 'YYYY-MM-DD';
      placeholder ??= getOrCreatePlaceholder('date', props);

      return mode === 'preview' ? (
        <span class={other.class} style={other.style}>
          {preview(value, previewFormat)}
        </span>
      ) : (
        <DatePicker type="date" placeholder={placeholder} {...other} {...model(value, onChange!)} />
      );
    };
  },
  { name: 'ADate', globalConfigKey: 'aDateProps' }
);

declare global {
  interface AtomicProps {
    date: ADateProps;
  }
}

export const ADate = defineAtomic({
  name: 'date',
  component: ADateComponent,
  description: '日期',
  author: 'ivan-lee',
});
