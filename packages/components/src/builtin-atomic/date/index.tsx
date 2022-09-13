import { DatePicker, DatePickerProps, model } from '@wakeadmin/component-adapter';
import { formatDate } from '@wakeadmin/utils';

import { globalRegistry, defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ADateValue = string | Date;
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

export const ADateComponent = defineAtomicComponent((props: ADateProps) => {
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
    let { value, mode, onChange, previewFormat, scene, context, ...other } = props;
    const passthrough = { ...configurable.aDateProps, ...other };

    previewFormat ??= passthrough.format ?? configurable.dateFormat ?? 'YYYY-MM-DD';

    return mode === 'preview' ? (
      <span>{preview(value, previewFormat)}</span>
    ) : (
      <DatePicker type="date" {...passthrough} {...model(value, onChange!)} />
    );
  };
});

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

globalRegistry.register('date', ADate);