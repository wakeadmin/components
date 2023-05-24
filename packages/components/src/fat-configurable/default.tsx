import { computed, Ref } from '@wakeadmin/demi';
import { II18n } from '../i18n';
import { FatConfigurable } from './types';

export function getDefaultConfigurable(i18n: Ref<II18n>) {
  return computed(() => {
    const t = i18n.value.t;

    const DEFAULT_CONFIGURABLE: FatConfigurable = {
      undefinedPlaceholder: '——',

      dateFormat: 'YYYY-MM-DD',

      dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',

      timeFormat: 'HH:mm',

      pagination: {
        pageSize: 10,
        layout: 'prev, pager, next, jumper, sizes, total',
        pageSizes: [10, 20, 30, 40, 50, 100],
      },

      aTextProps: {},

      aTextareaProps: {
        placeholder: t('wkc.enter'),
        rows: 4,
        showWordLimit: true,
        autosize: { minRows: 4, maxRows: 10 },
      },

      aPasswordProps: {
        placeholder: t('wkc.enterPassword'),
      },

      aSearchProps: {
        placeholder: t('wkc.enter'),
      },

      aUrlProps: {
        placeholder: t('wkc.enterLink'),
        copyable: true,
        ellipsis: 1,
      },

      aEmailProps: {
        placeholder: t('wkc.enterEmail'),
      },

      aPhoneProps: {
        placeholder: t('wkc.enterPhone'),
      },

      aSwitchProps: {
        previewActiveText: t('wkc.on'),
        previewInactiveText: t('wkc.off'),
      },

      aSelectProps: {
        placeholder: t('wkc.select'),
      },

      aMultiSelectProps: {
        placeholder: t('wkc.select'),
      },

      aDateProps: {
        placeholder: t('wkc.selectDate'),
      },

      aDateTimeProps: {
        placeholder: t('wkc.selectTime'),
      },

      aTimeProps: {
        placeholder: t('wkc.selectTime'),
      },

      aDateRangeProps: {
        startPlaceholder: t('wkc.startDate'),
        endPlaceholder: t('wkc.endDate'),
        rangeSeparator: t('wkc.rangeSeparator'),
      },

      aDateTimeRangeProps: {
        startPlaceholder: t('wkc.startTime'),
        endPlaceholder: t('wkc.endTime'),
        rangeSeparator: t('wkc.rangeSeparator'),
      },

      aTimeRangeProps: {
        startPlaceholder: t('wkc.startTime'),
        endPlaceholder: t('wkc.endTime'),
        rangeSeparator: t('wkc.rangeSeparator'),
      },

      aCheckboxProps: {
        previewActiveText: t('wkc.on'),
        previewInactiveText: t('wkc.off'),
      },

      aCascaderLazyProps: {
        placeholder: t('wkc.select'),
      },

      aCascaderProps: {
        placeholder: t('wkc.select'),
      },

      aIntegerProps: {
        placeholder: t('wkc.enterInteger'),
        max: 0x7fffffff,
      },

      aFloatProps: {
        placeholder: t('wkc.enterNumber'),
      },

      aCurrencyProps: {
        placeholder: t('wkc.enter'),
      },

      aCaptchaProps: {
        placeholder: t('wkc.enterCaptcha'),
      },

      fatTableModal: {
        enableCancel: true,
        enableConfirm: false,
      },
      fatTableSelectModal: {
        enableCancel: true,
        enableConfirm: true,
      },
    };

    return DEFAULT_CONFIGURABLE;
  });
}
