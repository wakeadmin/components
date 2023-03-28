import {
  createVNode,
  defineComponent,
  getCurrentInstance,
  isVue2,
  nextTick,
  render,
  Vue2,
  type AppContext,
} from '@wakeadmin/demi';

const Vue2Outlet = defineComponent({
  name: 'PortalHost',
});

export interface IPortal<T = any> {
  readonly instance: T;
  readonly host: HTMLElement | null;
  attach(): Promise<void>;
  detach(): void;
}

abstract class BasePortal<T> implements IPortal {
  protected attached = false;
  protected portalInstance: any;
  protected _instance: T | undefined;
  protected target: HTMLElement | null;
  protected context: any;
  protected _host: HTMLElement | null = null;
  constructor(
    protected component: () => any,
    options: {
      /**
       * 挂载目标
       *
       * 为`null`的话 则代表创建完成之后手动执行挂载操作
       *
       * 默认为 `document.body`
       */
      target?: HTMLElement | null;
      context?: any;
    } = {}
  ) {
    this.target = options.target === null ? null : options.target || document.body;
    const context = options.context || getCurrentInstance()?.proxy;
    if (!context) {
      throw new Error('无法获取对应的上下文');
    }

    this.context = context;
  }

  /**
   * 等待当前setup上下文全部执行完毕
   *
   * @remark
   * 如果当前上下文没有全部执行完成的话就调用`attach`的话 会导致后面的 composition API 都没办法正确挂载到正确的地方
   */
  protected async waitSetupFinish(): Promise<void> {
    while (true) {
      if (getCurrentInstance()) {
        // eslint-disable-next-line no-await-in-loop
        await nextTick();
        continue;
      }
      return undefined;
    }
  }

  get instance() {
    return this._instance;
  }

  get host() {
    return this._host;
  }

  abstract attach(): Promise<void>;
  abstract detach(): void;
}

/**
 *
 * @experimental
 *
 */
class Vue2Portal<T extends {} = any> extends BasePortal<T> {
  constructor(
    component: () => any,
    options: {
      /**
       * 挂载目标
       *
       * 为`null`的话 则代表创建完成之后手动执行挂载操作
       *
       * 默认为 `document.body`
       */
      target?: HTMLElement | null;
      context?: any;
    } = {}
  ) {
    super(component, options);
  }

  async attach() {
    if (this.attached) {
      return undefined;
    }

    await super.waitSetupFinish();

    this.portalInstance = this.createPortal();

    this._instance = this.portalInstance.$children[0];
    this._host = this.portalInstance.$el;
    if (this.target) {
      this.target.appendChild(this.portalInstance.$el);
    }

    this.attached = true;
  }

  detach() {
    if (!this.attached) {
      return undefined;
    }
    this.attached = false;
    this._instance = undefined;
    this.portalInstance.$destroy();
    this.portalInstance.$el.remove();
    this.portalInstance = null;
    this._host = null;
  }

  private createPortal(): any {
    const Portal = Vue2.extend(Vue2Outlet);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    return new Portal({
      el: document.createElement('div'),
      setup() {
        return () => {
          return <div> {context.component()}</div>;
        };
      },
      parent: this.context,
    });
  }
}

export class Vue3Portal<T extends {} = any> extends BasePortal<T> {
  constructor(
    component: () => any,
    options: {
      /**
       * 挂载目标
       *
       * 为`null`的话 则代表创建完成之后手动执行挂载操作
       *
       * 默认为 `document.body`
       */
      target?: HTMLElement | null;
      context?: any;
    } = {}
  ) {
    super(component, options);
  }

  async attach() {
    if (this.attached) {
      return undefined;
    }

    await super.waitSetupFinish();

    this.portalInstance = this.createPortal();

    render(this.portalInstance, document.createElement('div'));
    this.portalInstance.component.parent = this.context.$;

    this._instance = this.getExposeOrProxy(this.portalInstance);
    this._host = this.portalInstance.el;
    if (this.target) {
      this.target.appendChild(this._host!);
    }

    this.attached = true;
  }

  detach() {
    if (!this.attached) {
      return undefined;
    }
    this.attached = false;
    this._instance = undefined;
    // 借助render null 从而执行unmount;
    render(null, { _vnode: this.portalInstance.component.vnode } as any);

    this.portalInstance.el.remove();
    this.portalInstance = null;
    this._host = null;
  }

  private getExposeOrProxy(vnode: any): T {
    const component = vnode.component.subTree.children[0].component;
    if (!component) {
      return {} as T;
    }
    if (component.exposed) {
      return component.exposed;
    }
    return component.proxy;
  }

  private createAppContext(): AppContext {
    return {
      app: null as any,
      config: {
        isNativeTag: () => false,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: undefined,
        warnHandler: undefined,
        compilerOptions: {},
      },
      mixins: [],
      components: {},
      directives: {},
      provides: Object.create(null),
      // @ts-expect-error
      optionsCache: new WeakMap(),
      propsCache: new WeakMap(),
      emitsCache: new WeakMap(),
    };
  }

  private mergeAppContext(context: AppContext): AppContext {
    const initialAppContext = this.createAppContext();

    const keys = [
      ...new Set([...Object.keys(context), ...Object.keys(initialAppContext)]),
    ] as unknown as (keyof AppContext)[];

    return keys.reduce<AppContext>((appContext: AppContext, key: keyof AppContext) => {
      // @ts-expect-error
      appContext[key] = context[key] || initialAppContext[key];
      return appContext;
      // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    }, {} as any);
  }

  private createPortal(): any {
    const portal = createVNode(
      this.createOutlet(),
      {},
      {
        default: this.component,
      }
    );

    portal.appContext = this.mergeAppContext(this.context.$);
    return portal;
  }

  private createOutlet() {
    // eslint-disable-next-line vue/one-component-per-file
    return defineComponent({
      name: 'Vue3Portal',
      setup(_, { slots }) {
        return () => {
          return <div>{slots.default!()}</div>;
        };
      },
    });
  }
}

/**
 *
 * @experimental
 *
 * @remarks
 * `vue3` 下需要注意以下几点
 * - 其挂载内容如果为存在子组件的话 必须走导入模式
 * ```
 * // good
 * <ElButton> S </ElButton>
 * import {ElButton} from 'element-plus';
 *
 * // bad 不要用这种 不会被解析成组件
 * <el-button> S </el-button>
 * ```
 *
 */
export const Portal = (isVue2 ? Vue2Portal : Vue3Portal) as unknown as new <T>(
  component: () => any,
  options: {
    /**
     * 挂载目标
     *
     * 为`null`的话 则代表创建完成之后手动执行挂载操作
     *
     * 默认为 `document.body`
     */
    target?: HTMLElement | null;
    context?: any;
  }
) => IPortal<T>;
