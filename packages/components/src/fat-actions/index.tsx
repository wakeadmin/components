import {
  Button,
  Size,
  size as normalizeSize,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  ClassValue,
  CommonProps,
  StyleValue,
  MessageBox,
} from '@wakeadmin/element-adapter';
import { computed, toRef } from '@wakeadmin/demi';
import { declareComponent, declareEmits, declareProps, withDefaults } from '@wakeadmin/h';
import { More } from '@wakeadmin/icons';

import { RouteLocation, useRouter } from '../hooks';
import { createMessageBoxOptions, LooseMessageBoxOptions, normalizeClassName, normalizeStyle } from '../utils';

export interface FatAction {
  /**
   * 文案
   */
  name: string;

  /**
   * 按钮形式
   */
  type?: 'default' | 'danger' | 'warning';

  /**
   * 显示状态, 默认为 true
   */
  visible?: boolean;

  /**
   * 禁用
   */
  disabled?: boolean;

  /**
   * 点击事件, link 类型默认会打开路由, 可以返回 false 来阻止默认行为
   */
  onClick?: (action: FatAction) => boolean | undefined | Promise<boolean | undefined>;

  /**
   * 路由，如果提供这个，将忽略 onClick
   */
  link?: RouteLocation;

  /**
   * 自定义样式
   */
  style?: StyleValue;

  /**
   * 自定义类名
   */
  className?: ClassValue;

  /**
   * 文案提示
   */
  title?: string;

  /**
   * 确认弹窗，默认关闭
   */
  confirm?: LooseMessageBoxOptions<{ action: FatAction }>;
}

export interface FatActionsProps extends CommonProps {
  /**
   * 选项列表
   */
  options: FatAction[];

  /**
   * 最多显示多少个, 默认 3
   */
  max?: number;

  /**
   * 选项采用 按钮形式 还是 文本形式，默认为 文本形式
   */
  type?: 'text' | 'button';

  /**
   * 按钮大小，默认为 default
   */
  size?: Size;
}

export const FatActions = declareComponent({
  name: 'FatActions',
  props: declareProps<FatActionsProps>(['options', 'max', 'type', 'size']),
  emits: declareEmits<{
    click: (action: FatAction) => void;
  }>(),
  setup(props, { attrs }) {
    const propsWithDefault = withDefaults(props, { max: 3, type: 'text' });
    const router = useRouter();
    const max = toRef(propsWithDefault, 'max');
    const type = toRef(propsWithDefault, 'type');
    const size = computed(() => {
      return normalizeSize(props.size ?? 'default');
    });

    const rawList = computed(() => {
      return props.options.filter(i => i.visible !== false);
    });

    const list = computed(() => {
      return rawList.value.slice(0, max.value);
    });

    const moreList = computed(() => {
      return rawList.value.slice(max.value);
    });

    const handleClick = async (action: FatAction) => {
      if (action.confirm) {
        const options = createMessageBoxOptions(
          action.confirm,
          { title: '提示', message: '提示信息', type: 'warning', showCancelButton: true },
          { action }
        );

        if (options) {
          try {
            await MessageBox(options);
          } catch {
            return;
          }
        }
      }

      const shouldContinue = await action.onClick?.(action);

      if (shouldContinue === false) {
        return;
      }

      // 路由跳转
      if (action.link) {
        router?.push?.(action.link);
      }
    };

    return () => {
      return (
        <div class={normalizeClassName('fat-actions', attrs.class)} style={attrs.style}>
          {list.value.map((i, idx) => {
            return (
              <Button
                key={`${i.name}_${idx}`}
                class={normalizeClassName('fat-actions__btn', i.className, {
                  [i.type ?? 'default']: type.value === 'text',
                })}
                style={normalizeStyle(i.style)}
                type={type.value === 'text' ? 'text' : i.type}
                disabled={i.disabled}
                onClick={() => handleClick(i)}
                size={size.value}
                // @ts-expect-error
                title={i.title}
              >
                {i.name}
              </Button>
            );
          })}
          {!!moreList.value.length && (
            <Dropdown
              trigger="click"
              class="fat-actions__dropdown"
              onCommand={handleClick}
              v-slots={{
                dropdown: (
                  <DropdownMenu class="fat-actions__menu">
                    {moreList.value.map((i, idx) => {
                      return (
                        <DropdownItem
                          key={`${i.name}_${idx}`}
                          class={normalizeClassName('fat-actions__menu-item', i.className, i.type)}
                          style={normalizeStyle(i.style)}
                          disabled={i.disabled}
                          command={i}
                          // @ts-expect-error
                          title={i.title}
                        >
                          {i.name}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                ),
              }}
            >
              <i class="fat-actions__more">
                <More />
              </i>
            </Dropdown>
          )}
        </div>
      );
    };
  },
});
