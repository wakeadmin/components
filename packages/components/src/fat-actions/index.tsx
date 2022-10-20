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
import { computed, toRef, ref } from '@wakeadmin/demi';
import { declareComponent, declareProps, withDefaults } from '@wakeadmin/h';
import { More } from '@wakeadmin/icons';
import { isPromise } from '@wakeadmin/utils';

import { RouteLocation, useRouter } from '../hooks';
import { createMessageBoxOptions, LooseMessageBoxOptions, normalizeClassName, normalizeStyle } from '../utils';
import { MouseEventButton } from './enum';

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

  /**
   * 受控显示加载状态
   *
   * 如果 onClick 返回 Promise，FatActions 也会为该 Promise 维护 loading 状态
   *
   */
  loading?: boolean;
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

const FatActionInner = declareComponent({
  name: 'FatAction',
  props: declareProps<{ action: FatAction; type: 'button' | 'dropdown'; buttonType: 'text' | 'button'; size: string }>([
    'action',
    'type',
    'buttonType',
    'size',
  ]),
  setup(props) {
    const router = useRouter();
    const _loading = ref(false);

    const isDisabled = (action: FatAction) => {
      if (action.disabled != null) {
        return typeof action.disabled === 'function' ? action.disabled() : action.disabled;
      }

      return false;
    };

    const doCommand = async (action: FatAction) => {
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

      const result = action.onClick?.(action);
      let shouldContinue: any = true;

      if (isPromise(result)) {
        try {
          _loading.value = true;
          shouldContinue = await result;
        } finally {
          _loading.value = false;
        }
      } else {
        shouldContinue = result;
      }

      if (shouldContinue === false) {
        return;
      }

      // 路由跳转
      if (action.link) {
        router?.push?.(action.link);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (e.button === MouseEventButton.Main) {
        e.stopPropagation();

        doCommand(props.action);
      }
    };

    return () => {
      const { action: i, buttonType, size, type } = props;

      const title = typeof i.title === 'function' ? i.title() : i.title;
      const disabled = isDisabled(i);
      const loading = i.loading || _loading.value;

      if (type === 'button') {
        const content = (
          <Button
            class={normalizeClassName('fat-actions__btn', i.className, {
              [i.type ?? 'default']: buttonType === 'text',
            })}
            icon={i.icon}
            style={normalizeStyle(i.style)}
            type={buttonType === 'text' ? 'text' : i.type}
            disabled={disabled}
            onClick={handleClick}
            loading={loading}
            size={size}
          >
            {i.name}
          </Button>
        );
        if (title) {
          return (
            <Tooltip v-slots={{ content: title }}>
              <span class="fat-actions__btn">{content}</span>
            </Tooltip>
          );
        }
        return content;
      } else {
        const content = (
          <DropdownItem
            class={normalizeClassName('fat-actions__menu-item', i.className, i.type, {
              'fat-actions__menu-item--disabled': disabled,
            })}
            style={normalizeStyle(i.style)}
            disabled={disabled || loading}
            command={i}
            icon={i.icon}
            // @ts-expect-error
            onMousedown={handleClick} // vue 3
            onMousedownNative={handleClick} // vue 2
          >
            {i.name}
          </DropdownItem>
        );
        if (title) {
          return (
            <Tooltip v-slots={{ content: title }} placement="left-start">
              {content}
            </Tooltip>
          );
        }
        return content;
      }
    };
  },
});

export const FatActions = declareComponent({
  name: 'FatActions',
  props: declareProps<FatActionsProps>(['options', 'max', 'type', 'size']),
  setup(props, { attrs }) {
    const propsWithDefault = withDefaults(props, { max: 3, type: 'text' });
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

    return () => {
      return (
        <div class={normalizeClassName('fat-actions', attrs.class)} style={attrs.style}>
          {list.value.map((i, idx) => {
            return <FatActionInner action={i} key={idx} type="button" buttonType={type.value!} size={size.value!} />;
          })}

          {!!moreList.value.length && (
            <Dropdown
              trigger="click"
              class="fat-actions__dropdown"
              v-slots={{
                dropdown: (
                  <DropdownMenu class="fat-actions__menu fat-actions__dropdown-menu">
                    {moreList.value.map((i, idx) => {
                      return (
                        <FatActionInner
                          key={idx}
                          size={size.value!}
                          buttonType={type.value!}
                          type="dropdown"
                          action={i}
                        />
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
