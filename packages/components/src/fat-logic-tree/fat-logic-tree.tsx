/**
 * 逻辑树
 */
import { computed } from '@wakeadmin/demi';
import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { OurComponentInstance, ToHSlotDefinition, normalizeClassName, renderSlot, hasSlots } from '../utils';
import { NoopArray, isObject } from '@wakeadmin/utils';
import { useT } from '../hooks';

/**
 * 节点渲染参数
 */
export interface FatLogicTreeNodeMethods<Item extends {} = any> {
  /**
   * 当前节点是否为分组
   */
  isGroup: boolean;

  /**
   * 子孙中是否包含了分组
   */
  hasGroupOnDescendant: boolean;

  /**
   * 当前项的索引
   */
  index: number;

  /**
   * 完整的索引
   */
  indexs: number[];

  /**
   * 树的深度
   */
  depth: number;

  /**
   * 当前项的完整路径
   */
  path: string;

  /**
   * 当前节点
   */
  current: Item;

  /**
   * 父节点
   */
  parent?: Item;

  /**
   * 当前逻辑类型
   */
  logicType: LogicType;

  /**
   * 删除当前节点
   */
  remove(): void;

  /**
   * 在当前节点之前插入
   * @param item
   */
  insertBefore(...item: Item[]): void;

  /**
   * 在当前节点之后插入
   * @param item
   */
  insertAfter(...item: Item[]): void;

  /**
   * 设置逻辑类型
   * @param type
   * @note 仅分组支持
   */
  setLogicType(type: LogicType): void;

  /**
   * 添加追加子级
   * @note 仅分组支持
   */
  append(...item: Item[]): void;
}

/**
 * 插槽声明
 */
export interface FatLogicTreeSlots<Item extends {} = any> {
  /**
   * 渲染选择树节点
   * @param props
   * @returns
   */
  renderNode?: (props: FatLogicTreeNodeMethods<Item>) => any;

  /**
   * 渲染分组
   * @param props
   * @returns
   */
  renderGroup?: (props: FatLogicTreeNodeMethods<Item> & { vdom: any }) => any;
}

export interface FatLogicTreeEvents<Item extends {} = any> {
  'onUpdate:modelValue'?: (value: Item) => void;
}
export interface FatLogicTreeMethods<Item extends {} = any> {}

export enum LogicType {
  AND = 'AND',
  OR = 'OR',
}

/**
 * 声明树的结构
 */
export interface FatLogicTreeStruct<Item extends {} = any> {
  /**
   * 唯一标识符, 默认为 id
   */
  id?: string;

  /**
   * 子级列表, 默认为 children
   */
  children?: string;

  /**
   * 判断是否为分组, 默认根据 children 来判断，存在 children 则为分组
   * @param item
   * @returns
   */
  isGroup?: (item: Item) => boolean;

  /**
   * 判断分组逻辑类型, 默认从 type 中获取，如果没有则为 AND
   */
  getLogicType?: (item: Item) => LogicType;

  /**
   * 切换逻辑分类, 返回一个新的对象
   */
  setLogicType?: (item: Item, type: LogicType) => Item;
}

export interface FatLogicTreeProps<Item extends {} = any> extends FatLogicTreeSlots<Item>, FatLogicTreeEvents<Item> {
  /**
   * 基础路径。例如 a.b.c、b[0]
   * 如果和 FatForm 配合使用，会自动拼接上 prop
   */
  basePath?: string;

  /**
   * 树结构的描述
   */
  treeStruct?: FatLogicTreeStruct<Item>;

  /**
   * 树数据
   */
  modelValue?: any;

  /**
   * AND 文案
   */
  andText?: any;

  /**
   * OR 文案
   */
  orText?: any;

  /**
   * AND 颜色
   * 默认为主色
   */
  andColor?: string;

  /**
   * OR 颜色
   * 默认为辅助色
   */
  orColor?: string;
}

interface InnerNode {
  /**
   * 节点唯一 id
   */
  id?: string | number;

  /**
   * 分组标签，比如 且 或
   */
  type: LogicType;

  /**
   * 子节点
   */
  children?: any[];

  /**
   * 原始类型
   */
  raw: any;
}

const AUTO_UNIQ_KEY: unique symbol = Symbol('AUTO_UNIQ_KEY');
const DEFAULT_TREE_STRUCT: Required<FatLogicTreeStruct> = {
  id: 'id',
  children: 'children',
  getLogicType: i => {
    return i.type !== LogicType.OR ? LogicType.AND : LogicType.OR;
  },
  isGroup: i => {
    return i != null && typeof i === 'object' && i.children != null;
  },
  setLogicType: (item, type) => {
    return { ...item, type };
  },
};

const getTreeStruct = (treeStruct?: FatLogicTreeStruct): Required<FatLogicTreeStruct> => {
  if (treeStruct == null) {
    return DEFAULT_TREE_STRUCT;
  }

  const { id, children, getLogicType, isGroup, setLogicType } = treeStruct;

  return {
    id: id ?? DEFAULT_TREE_STRUCT.id,
    children: children ?? DEFAULT_TREE_STRUCT.children,
    getLogicType: getLogicType ?? DEFAULT_TREE_STRUCT.getLogicType,
    isGroup:
      isGroup ??
      (children
        ? i => {
            return i != null && typeof i === 'object' && i[children] != null;
          }
        : DEFAULT_TREE_STRUCT.isGroup),
    setLogicType: setLogicType ?? DEFAULT_TREE_STRUCT.setLogicType,
  };
};

const getNodeInfo = (data: any, treeStruct?: FatLogicTreeStruct): InnerNode | undefined => {
  const { id: idKey, children: childrenKey, getLogicType } = getTreeStruct(treeStruct);

  if (data == null || typeof data !== 'object') {
    return undefined;
  }

  const id = data[idKey] ?? data[AUTO_UNIQ_KEY];
  const type = getLogicType(data);
  const children = data[childrenKey];

  return {
    id,
    type,
    children,
    raw: data,
  };
};

const getChildrenKey = (treeStruct?: FatLogicTreeStruct) => {
  return getTreeStruct(treeStruct).children;
};

/**
 * 节点列表
 */
const TreeList = declareComponent({
  name: 'TreeList',
  props: declareProps<{
    innerProps: {
      treeStruct?: FatLogicTreeStruct;
      value: any;
      onChange?: (value: any) => void;
      parent?: any;
      path: string;
      index: number;
      indexs: number[];
      depth: number;
      type: LogicType;
      children?: any[];
      andText?: any;
      orText?: any;
      andColor?: string;
      orColor?: string;

      /**
       * 渲染子元素
       * @returns
       */
      renderNode: (scope: FatLogicTreeNodeMethods) => any;

      /**
       * 渲染分组
       * @param scope
       * @returns
       */
      renderGroup: (scope: FatLogicTreeNodeMethods & { vdom: any }) => any;

      /**
       * 删除子元素
       * @param item
       * @returns
       */
      onRemoveChild: (item: any) => void;

      /**
       * 插入子元素
       */
      onInsert: (items: any[], related: any, position: -1 | 1) => void;
    };
  }>({ innerProps: null }),
  setup(props) {
    const instance = computed(() => {
      if (props.innerProps.value == null) {
        return null;
      }

      const assertObject = (item: any) => {
        if (!isObject(item)) {
          throw new Error('item 必须是一个对象');
        }
      };

      const assertParent = () => {
        if (props.innerProps.parent == null) {
          throw new Error('parent 不能为空');
        }
      };

      const methods: FatLogicTreeNodeMethods = {
        get isGroup() {
          return !!props.innerProps.children;
        },
        get hasGroupOnDescendant(): boolean {
          const { isGroup } = getTreeStruct(props.innerProps.treeStruct);
          return !!props.innerProps.children?.some(i => isGroup(i));
        },
        get depth() {
          return props.innerProps.depth;
        },
        get current() {
          return props.innerProps.value;
        },
        get index() {
          return props.innerProps.index;
        },
        get indexs() {
          return props.innerProps.indexs;
        },
        get path() {
          return props.innerProps.path;
        },
        get parent() {
          return props.innerProps.parent;
        },
        get logicType() {
          return props.innerProps.type;
        },
        setLogicType(type) {
          const newValue = (props.innerProps.treeStruct?.setLogicType ?? DEFAULT_TREE_STRUCT.setLogicType)(
            props.innerProps.value,
            type
          );

          if (!isObject(newValue)) {
            throw new Error('setLogicType 必须返回一个对象');
          }

          props.innerProps.onChange?.(newValue);
        },
        insertBefore(...items) {
          items.forEach(assertObject);
          assertParent();

          props.innerProps.onInsert(items, props.innerProps.value, -1);
        },
        insertAfter(...items) {
          items.forEach(assertObject);
          assertParent();
          props.innerProps.onInsert(items, props.innerProps.value, 1);
        },
        remove() {
          if (props.innerProps.parent == null) {
            return;
          }

          props.innerProps.onRemoveChild?.(props.innerProps.value);
        },
        /**
         * 追加子节点
         * @param item
         */
        append(...items) {
          const listToAppend: any[] = [];
          const info = getNodeInfo(props.innerProps.value, props.innerProps.treeStruct);
          if (info == null) {
            throw new Error('无法获取节点信息');
          }

          items.forEach(item => {
            assertObject(item);

            // 添加默认的唯一标识符
            const uid = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
            (item as any)[AUTO_UNIQ_KEY] = uid;

            listToAppend.push(item);
          });

          if (listToAppend.length) {
            const list = (info.children ?? NoopArray).slice(0);
            listToAppend.forEach(i => {
              list.push(i);
            });

            const newValue = { ...props.innerProps.value, [getChildrenKey(props.innerProps.treeStruct)]: list };

            props.innerProps.onChange?.(newValue);
          }
        },
      };

      return methods;
    });

    const toggleLogic = () => {
      const nextType = instance.value?.logicType === LogicType.AND ? LogicType.OR : LogicType.AND;
      instance.value?.setLogicType(nextType);
    };
    const t = useT();

    return () => {
      const {
        value,
        type,
        children,
        andText = t('wkc.and'),
        orText = t('wkc.or'),
        andColor = 'var(--fat-color-primary)',
        orColor = '#2AC2D4',
      } = props.innerProps;

      if (value == null) {
        return null;
      }

      const isGroup = instance.value?.isGroup;
      // 只有多个元素时才显示标签
      const hasLabel = isGroup && children && children.length > 1;

      return (
        <div class="fat-logic-tree__content">
          {isGroup ? (
            /* 分组 */
            props.innerProps.renderGroup({
              ...instance.value!,
              vdom: (
                <div class={['fat-logic-tree__list', { 'has-label': hasLabel }]}>
                  {hasLabel && (
                    <div
                      class={['fat-logic-tree__label', type === LogicType.AND ? 'and' : 'or']}
                      style={{ '--color': type === LogicType.AND ? andColor : orColor }}
                      onClick={toggleLogic}
                    >
                      <span class="fat-logic-tree__label-content">{type === LogicType.AND ? andText : orText}</span>
                    </div>
                  )}
                  <div class="fat-logic-tree__group">
                    {children?.map((i, idx) => {
                      const node = getNodeInfo(i, props.innerProps.treeStruct);

                      if (node == null) {
                        return null;
                      }

                      const childrenKey = getChildrenKey(props.innerProps.treeStruct);
                      const path = props.innerProps.path
                        ? `${props.innerProps.path}.${childrenKey}.${idx}`
                        : `${childrenKey}.${idx}`;

                      return (
                        <TreeList
                          key={node.id ?? idx}
                          innerProps={{
                            ...props.innerProps,
                            depth: props.innerProps.depth + 1,
                            value: i,
                            parent: value,
                            type: node.type,
                            path,
                            index: idx,
                            indexs: [...props.innerProps.indexs, idx],
                            children: node.children,
                            onChange: newValue => {
                              // 向上冒泡
                              const list = (children ?? NoopArray).slice(0);
                              list[idx] = newValue;
                              const newNode = { ...value, [childrenKey]: list };

                              props.innerProps.onChange?.(newNode);
                            },
                            onRemoveChild: child => {
                              const index = children.indexOf(child);

                              if (index !== -1) {
                                const clone = children.slice(0);
                                clone.splice(index, 1);

                                if (clone.length || props.innerProps.parent == null) {
                                  const newNode = { ...value, [childrenKey]: clone };
                                  props.innerProps.onChange?.(newNode);
                                } else {
                                  // 向上冒泡删除
                                  instance.value?.remove();
                                }
                              }
                            },
                            onInsert(items, related, position) {
                              const index = children.indexOf(related);
                              if (index === -1) {
                                return;
                              }

                              const clone = children.slice(0);
                              clone.splice(position === -1 ? index : index + 1, 0, ...items);
                              const newNode = { ...value, [childrenKey]: clone };

                              props.innerProps.onChange?.(newNode);
                            },
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              ),
            })
          ) : (
            <div class="fat-logic-tree__node">{props.innerProps.renderNode(instance.value!)}</div>
          )}
        </div>
      );
    };
  },
});

/**
 * 逻辑树
 */
const FatLogicTreeInner = declareComponent({
  name: 'FatFormLogicTree',
  props: declareProps<FatLogicTreeProps<any>>({
    basePath: String,
    treeStruct: null,
    modelValue: null,
    andText: null,
    orText: null,
    andColor: null,
    orColor: null,

    // slots
    renderNode: null,
    renderGroup: null,
  }),
  slots: declareSlots<ToHSlotDefinition<FatLogicTreeSlots<any>>>(),
  setup(props, { slots, attrs, emit }) {
    return () => {
      const { treeStruct, modelValue, basePath, andText, andColor, orText, orColor } = props;
      const nodeInfo = getNodeInfo(modelValue, treeStruct);
      const childrenKey = getChildrenKey(treeStruct);

      if (nodeInfo == null) {
        return null;
      }

      return (
        <div class={normalizeClassName('fat-logic-tree', attrs.class)} style={attrs.style}>
          <TreeList
            innerProps={{
              treeStruct,
              value: modelValue,
              type: nodeInfo!.type,
              children: nodeInfo?.children,
              path: basePath ?? '',
              index: 0,
              indexs: [0],
              depth: 0,
              andText,
              andColor,
              orText,
              orColor,
              renderNode: scope => renderSlot(props, slots, 'node', scope),
              renderGroup: scope => {
                return hasSlots(props, slots, 'group') ? renderSlot(props, slots, 'group', scope) : scope.vdom;
              },
              onInsert: (items, related, position) => {
                const children = (nodeInfo?.children ?? NoopArray).slice(0);
                const index = children.indexOf(related);
                if (index !== -1) {
                  children.splice(position === -1 ? index : index + 1, 0, ...items);
                  const newValue = { ...modelValue, [childrenKey]: children };
                  emit('update:modelValue', newValue);
                }
              },
              onRemoveChild: child => {
                const children = (nodeInfo?.children ?? NoopArray).slice(0);
                const index = children.indexOf(child);

                if (index !== -1) {
                  children.splice(index, 1);
                  const newValue = { ...modelValue, [childrenKey]: children };
                  emit('update:modelValue', newValue);
                }
              },
              onChange: newValue => {
                emit('update:modelValue', newValue);
              },
            }}
          ></TreeList>
        </div>
      );
    };
  },
});

export const FatLogicTree = FatLogicTreeInner as unknown as new <Item extends {} = any>(
  props: FatLogicTreeProps<Item>
) => OurComponentInstance<typeof props, FatLogicTreeSlots<Item>, FatLogicTreeEvents<Item>, FatLogicTreeMethods<Item>>;
