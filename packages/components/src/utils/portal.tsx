import { defineComponent, getCurrentInstance, Vue2, isVue2 } from '@wakeadmin/demi';

const PortalComponent = isVue2
  ? Vue2.extend(
      defineComponent({
        name: 'PortalHost',
      })
    )
  : ((() => {
      throw new Error('不支持Vue3');
    }) as any);

/**
 *
 * @experimental 目前只支持vue2
 *
 */
export class Portal<T extends {} = any> {
  private attached = false;
  private portalInstance: any;
  private _instance: T | undefined;
  private target: HTMLElement | null;
  private context: any;
  // @ts-expect-error
  private readonly isSetup: boolean;
  private _host: HTMLElement | null = null;

  constructor(
    private component: () => any,
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
    this.isSetup = !!context._setupContext;

    this.context = context;
  }

  get instance() {
    return this._instance;
  }

  get host() {
    return this._host;
  }

  attach() {
    if (this.attached) {
      return undefined;
    }
    this.injectDestroyHook();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    this.portalInstance = new PortalComponent({
      el: document.createElement('div'),
      setup() {
        return () => {
          return <div> {context.component()}</div>;
        };
      },
      parent: this.context,
    });

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

  private injectDestroyHook() {
    const hooks = this.context.$options.beforeDestroy as any as Function[];
    if (hooks && hooks.length > 0) {
      hooks.push(() => {
        this.detach();
      });
    } else {
      this.context.$options.beforeDestroy = [
        () => {
          this.detach();
        },
      ];
    }
  }
}
