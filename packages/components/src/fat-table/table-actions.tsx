import {
  Button,
  Size,
  size as normalizeSize,
  Dropdown,
  DropdownItem,
  DropdownMenu,
} from '@wakeadmin/component-adapter';
import { computed, toRef } from '@wakeadmin/demi';
import { declareComponent, declareEmits, declareProps, withDefaults } from '@wakeadmin/h';
import { More } from '@wakeadmin/icons';

import { RouteLocation, useRouter } from '../hooks';
import { ClassValue, CommonProps, StyleValue } from '../types';

import './table-actions.scss';

export interface FatTableAction {
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
  onClick?: (action: FatTableAction) => boolean | undefined | Promise<boolean | undefined>;

  /**
   * 路由，如果提供这个，将忽略 onClick
   */
  link?: RouteLocation;

  /**
   * 自定义样式
   */
  style?: StyleValue;
  class?: ClassValue;
}

export interface FatTableActionsProps extends CommonProps {
  /**
   * 选项列表
   */
  options: FatTableAction[];

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

export const FatTableActions = declareComponent({
  name: 'FatTableActions',
  props: declareProps<FatTableActionsProps>(['options', 'max', 'type', 'size']),
  emits: declareEmits<{
    click: (action: FatTableAction) => void;
  }>(),
  setup(props) {
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

    const handleClick = async (action: FatTableAction) => {
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
        <div class={['fat-table-actions', props.class]} style={props.style}>
          {list.value.map((i, idx) => {
            return (
              <Button
                key={`${i.name}_${idx}`}
                class={['fat-table-actions__btn', i.class, { [i.type ?? 'default']: type.value === 'text' }]}
                style={i.style}
                type={type.value === 'text' ? 'text' : i.type}
                disabled={i.disabled}
                onClick={() => handleClick(i)}
                size={size.value}
              >
                {i.name}
              </Button>
            );
          })}
          {!!moreList.value.length && (
            <Dropdown
              trigger="click"
              class="fat-table-actions__dropdown"
              onCommand={handleClick}
              v-slots={{
                dropdown: (
                  <DropdownMenu class="fat-table-actions__menu">
                    {moreList.value.map((i, idx) => {
                      return (
                        <DropdownItem
                          key={`${i.name}_${idx}`}
                          class={['fat-table-action__menu-item', i.class, i.type]}
                          style={i.style}
                          disabled={i.disabled}
                          command={i}
                        >
                          {i.name}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                ),
              }}
            >
              <i class="fat-table-actions__more">
                <More />
              </i>
            </Dropdown>
          )}
        </div>
      );
    };
  },
});
