import { declareComponent } from '@wakeadmin/h';

/**
 * 页面内容
 * @deprecated 使用 FatCard 代替
 */
export const FatContent = declareComponent({
  name: 'FatContent',
  setup(_, { slots, attrs }) {
    return () => {
      return (
        <div class={['fat-content', attrs.class]} style={attrs.style}>
          {slots.default?.()}
        </div>
      );
    };
  },
});
