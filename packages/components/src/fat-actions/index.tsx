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
  Tooltip,
} from '@wakeadmin/element-adapter';
import { computed, toRef } from '@wakeadmin/demi';
import { declareComponent, declareProps, withDefaults } from '@wakeadmin/h';
import { More } from '@wakeadmin/icons';

import { RouteLocation, useRouter } from '../hooks';
import { createMessageBoxOptions, LooseMessageBoxOptions, normalizeClassName, normalizeStyle } from '../utils';

export interface FatAction {
  /**
   * 文案
   *
   * 可以传入一个jsx
   */
  name: any;

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
  disabled?: boolean | (() => boolean);

  /**
   * 点击事件, link 类型默认会打开路由, 可以返回 false 来阻止默认行为
   */
  onClick?: (action: FatAction) => boolean | void | Promise<boolean | void>;

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
  title?: string | (() => string);

  /**
   * 图标
   */
  icon?: any;

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

    const isDisabled = (action: FatAction) => {
      if (action.disabled != null) {
        return typeof action.disabled === 'function' ? action.disabled() : action.disabled;
      }

      return false;
    };

    const handleClick = async (action: FatAction) => {
      if (isDisabled(action)) {
        return;
      }

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
            const content = (
              <Button
                key={`${i.name}_${idx}`}
                class={normalizeClassName('fat-actions__btn', i.className, {
                  [i.type ?? 'default']: type.value === 'text',
                })}
                icon={i.icon}
                style={normalizeStyle(i.style)}
                type={type.value === 'text' ? 'text' : i.type}
                disabled={isDisabled(i)}
                onClick={() => handleClick(i)}
                size={size.value}
              >
                {i.name}
              </Button>
            );
            const title = typeof i.title === 'function' ? i.title() : i.title;
            if (title) {
              return (
                <Tooltip v-slots={{ content: title }} key={`${i.name}_${idx}`}>
                  <span class="fat-actions__btn">{content}</span>
                </Tooltip>
              );
            }
            return content;
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
                      const disabled = isDisabled(i);
                      const title = typeof i.title === 'function' ? i.title() : i.title;
                      const content = (
                        <DropdownItem
                          key={`${i.name}_${idx}`}
                          class={normalizeClassName('fat-actions__menu-item', i.className, i.type, {
                            'fat-actions__menu-item--disabled': disabled,
                          })}
                          style={normalizeStyle(i.style)}
                          disabled={disabled}
                          command={i}
                          icon={i.icon}
                        >
                          {i.name}
                        </DropdownItem>
                      );
                      if (title) {
                        return (
                          <Tooltip v-slots={{ content: title }} key={`${i.name}_${idx}`} placement="left-start">
                            {content}
                          </Tooltip>
                        );
                      }
                      return content;
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
