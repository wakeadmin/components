/* eslint-disable vue/one-component-per-file */
import {
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  ref,
  watch,
  nextTick,
  onBeforeUnmount,
} from '@wakeadmin/demi';
import { get, isObject, NoopArray, cloneDeep, debounce, omit } from '@wakeadmin/utils';
import { Tree, Select } from 'element-ui';

import { dispatch, escapeRegexpString, forwardExpose } from '../utils';

const resetPropsDefault = props => {
  const clone = cloneDeep(props);

  for (const key in clone) {
    clone[key].default = undefined;
  }

  return clone;
};

const TreeInner = defineComponent({
  name: 'ElTreeSelectTree',
  // 支持接收 select 的事件
  componentName: 'ElOption',
  props: { ...resetPropsDefault(Tree.props), refSetter: null },
  setup(props, { emit, slots }) {
    const vm = getCurrentInstance().proxy;
    const select = inject('select');
    const treeRef = ref();

    // 伪装 option 注册
    const instance = {};

    select.options.push(instance);
    select.optionsCount++;
    select.filteredOptionsCount++;

    onBeforeUnmount(() => {
      const idx = select.options.indexOf(instance);

      if (idx !== -1) {
        select.options.splice(idx, 1);
        select.onOptionDestroy(idx);
      }
    });

    const nodeKey = computed(() => props.nodeKey ?? 'value');
    const getValue = data => {
      return get(data, nodeKey.value);
    };
    const getLabel = data => {
      const labelKey = props.props?.label ?? 'label';
      const key = getValue(data);

      return typeof labelKey === 'string' ? data[labelKey] : labelKey(data, treeRef.value?.getNode(key));
    };

    const nodeToSelectOption = node => {
      return {
        value: getValue(node.data),
        currentLabel: getLabel(node.data),
      };
    };

    // 改写 select 的 getOption 以支持回显
    const oldGetOption = select.getOption.bind(select);
    select.getOption = value => {
      if (treeRef.value == null) {
        return oldGetOption(value);
      }

      if (isObject(value)) {
        const valueKey = get(value, select.valueKey);

        if (valueKey == null) {
          return oldGetOption(value);
        }

        // 性能稍差，需要遍历所有节点
        const allNodes = treeRef.value.store.nodesMap;
        for (const key in allNodes) {
          const node = allNodes[key];
          // eslint-disable-next-line no-shadow
          const nodeKey = get(getValue(node.data), select.valueKey);
          if (nodeKey === valueKey) {
            return nodeToSelectOption(node);
          }
        }
      } else if (value != null) {
        // 按照 key 获取
        const node = treeRef.value.getNode(value);
        if (node) {
          return nodeToSelectOption(node);
        }
      }

      return oldGetOption(value);
    };

    // 多选模式
    const multiple = computed(() => {
      return select.multiple;
    });

    const showCheckbox = computed(() => {
      return props.showCheckbox;
    });

    const checkStrictly = computed(() => {
      return props.checkStrictly;
    });

    const expandOnClickNode = computed(() => {
      // 体验更好
      if (!showCheckbox.value && checkStrictly.value) {
        return false;
      }

      return props.expandOnClickNode ?? true;
    });

    const value = computed(() => select.value);

    // 已选中值
    const checked = computed(() => {
      const selectValue = value.value;

      const getKey = val => {
        return isObject(val) ? get(val, select.valueKey) : val;
      };

      if (multiple.value) {
        if (Array.isArray(selectValue)) {
          return selectValue.map(getKey);
        } else {
          return NoopArray;
        }
      } else if (selectValue != null) {
        return [getKey(selectValue)];
      }

      return NoopArray;
    });

    // 判断是否为叶子节点
    const isLeaf = key => {
      const node = treeRef.value?.getNode(key);

      return node?.isLeaf;
    };

    // 高亮规则
    const isSelected = node => {
      const isChecked = node.checked;

      if (checkStrictly.value) {
        return isChecked;
      } else {
        // 高亮叶子节点
        return isChecked && node.isLeaf;
      }
    };

    // 获取叶子节点
    const getLeafs = checkedDatas => {
      return checkedDatas.filter(d => isLeaf(getValue(d)));
    };

    const keyToOption = key => {
      return { value: key };
    };

    const emitChangeByChecked = async keys => {
      // select 使用 toggle 形式来切换，这里需要根据选中状态
      const checkedKeys = checked.value;

      // 新增选中
      const keysIncluding = keys.filter(key => {
        return !checkedKeys.includes(key);
      });

      // 取消选中
      const keysExcluding = checkedKeys.filter(key => {
        return !keys.includes(key);
      });

      const keysToEmit = keysExcluding.concat(keysIncluding);

      for (const key of keysToEmit) {
        dispatch(vm, 'ElSelect', 'handleOptionClick', [keyToOption(key), true]);
        // eslint-disable-next-line no-await-in-loop
        await nextTick();
      }
    };

    // checkbox 模式
    const handleCheck = (node, currentChecked) => {
      emit('check', node, currentChecked);

      if (!showCheckbox.value) {
        return;
      }

      // 无关联模式
      if (checkStrictly.value) {
        emitChangeByChecked(currentChecked.checkedNodes.map(getValue));
      } else {
        // 提取子级节点
        const leafs = getLeafs(currentChecked.checkedNodes);
        emitChangeByChecked(leafs.map(getValue));
      }
    };

    const emitChangeByClick = key => {
      dispatch(vm, 'ElSelect', 'handleOptionClick', [keyToOption(key), true]);
    };

    const handleClick = (data, node, compInstance) => {
      emit('node-click', data, node, compInstance);

      if (showCheckbox.value || node.disabled) {
        return;
      }

      if (checkStrictly.value) {
        // 严格模式, 所有节点都可以点击
        emitChangeByClick(getValue(data));
      } else if (isLeaf(getValue(data))) {
        // 只有叶子节点可以点击
        emitChangeByClick(getValue(data));
      }
    };

    const emitSelectedChanged = debounce(() => {
      dispatch(vm, 'ElSelect', 'setSelected');
    }, 500);

    // 支持筛选
    const handleQueryChange = query => {
      treeRef.value?.filter(query);
    };

    // 节点过滤方法
    const handleFilter = (query, data, node) => {
      if (props.filterNodeMethod) {
        return props.filterNodeMethod(query, data, node);
      }

      // 默认根据 label 过滤
      const matched = new RegExp(escapeRegexpString(query), 'i').test(node.label);

      return matched;
    };

    // 更新选中状态
    watch(
      checked,
      checkedKeys => {
        treeRef.value?.setCheckedKeys(checkedKeys);
      },
      { immediate: true }
    );

    // 暴露 ref 到外部
    watch(
      treeRef,
      inst => {
        props.refSetter?.(inst);
      },
      { immediate: true }
    );

    // 监听 data 变动，刷新选中状态
    watch(
      () => props.data,
      () => {
        emitSelectedChanged();
      },
      { deep: true }
    );

    // 拦截异步加载，刷新选中状态
    const load = computed(() => {
      if (props.load) {
        return (node, resolve) => {
          return props.load(node, (...args) => {
            emitSelectedChanged();
            resolve(...args);
          });
        };
      }

      return undefined;
    });

    vm.$on('queryChange', handleQueryChange);

    return () => {
      return (
        <Tree
          {...props}
          on={omit(vm.$listeners, 'check', 'node-click')}
          nodeKey={nodeKey.value}
          ref={treeRef}
          onCheck={handleCheck}
          onNodeClick={handleClick}
          expandOnClickNode={expandOnClickNode.value}
          filterNodeMethod={handleFilter}
          load={load.value}
          v-slots={{
            default: scope => {
              const { node } = scope;
              return (
                <div
                  class={[
                    'el-tree-node__label el-select-dropdown__item',
                    { selected: isSelected(node), 'is-disabled': node.disabled },
                  ]}
                >
                  {slots.default ? slots.default(scope) : node.label}
                </div>
              );
            },
          }}
        ></Tree>
      );
    };
  },
});

export const TreeSelect = defineComponent({
  name: 'ElTreeSelect',
  props: resetPropsDefault(Select.props),
  setup(props, { attrs, slots, expose }) {
    const vm = getCurrentInstance().proxy;
    const selectRef = ref();
    const treeRef = ref();

    const treeRefSetter = r => (treeRef.value = r);

    const instance = {};
    forwardExpose(instance, ['focus', 'blur'], selectRef);
    forwardExpose(
      instance,
      [
        'filter',
        'updateKeyChildren',
        'getCheckedNodes',
        'setCheckedNodes',
        'getCheckedKeys',
        'setCheckedKeys',
        'setChecked',
        'getHalfCheckedNodes',
        'getHalfCheckedKeys',
        'getCurrentKey',
        'getCurrentNode',
        'setCurrentKey',
        'setCurrentNode',
        'getNode',
        'remove',
        'append',
        'insertBefore',
        'insertAfter',
      ],
      treeRef
    );

    expose(instance);

    return () => {
      return (
        <Select {...props} class="ad-tree-select" on={vm.$listeners} ref={selectRef} v-slots={omit(slots, 'default')}>
          <TreeInner
            class="ad-tree-select__tree"
            {...attrs}
            refSetter={treeRefSetter}
            on={{ ...vm.$listeners }}
            v-slots={{ default: slots.default }}
          />
        </Select>
      );
    };
  },
});
