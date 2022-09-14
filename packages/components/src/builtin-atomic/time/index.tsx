import { TimePicker, TimePickerProps, model } from '@wakeadmin/component-adapter';
import { formatDate } from '@wakeadmin/utils';

import { globalRegistry, defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ATimeValue = string | Date;
export type ATimeProps = DefineAtomicProps<
  ATimeValue,
  TimePickerProps,
  {
    /**
     * 预览时日期格式，默认同 format
     */
    previewFormat?: string;

    /**
     * 自定义预览
     */
    renderPreview?: (value: ATimeValue) => any;
  }
>;

export const ATimeComponent = defineAtomicComponent(
  (props: ATimeProps) => {
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

      previewFormat ??= other.format ?? configurable.timeFormat ?? 'HH:mm';

      return mode === 'preview' ? (
        <span>{preview(value, previewFormat)}</span>
      ) : (
        <TimePicker {...other} {...model(value, onChange!)} />
      );
    };
  },
  { name: 'ATime', globalConfigKey: 'aTimeProps' }
);

declare global {
  interface AtomicProps {
    time: ATimeProps;
  }
}

export const ATime = defineAtomic({
  name: 'time',
  component: ATimeComponent,
  description: '时间',
  author: 'ivan-lee',
});

globalRegistry.register('time', ATime);
