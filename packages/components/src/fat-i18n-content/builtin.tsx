/* eslint-disable spaced-comment */
import { Input } from '@wakeadmin/element-adapter';
import { createFatI18nContentControl } from '.';

/**
 * 内置包装好的组件
 */

/**
 * 输入框
 */
export const FatI18nInput = /*#__PURE__ */ createFatI18nContentControl(Input, {
  inject(badge, target) {
    return target({
      'v-slots': {
        suffix: badge(),
      },
    });
  },
});

/**
 * 长文本输入框
 */
export const FatI18nTextarea = /*#__PURE__ */ createFatI18nContentControl(Input, {
  position: 'rightBottom',
  targetProps: {
    type: 'textarea',
  },
});
