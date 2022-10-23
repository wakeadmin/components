import { StepProps } from '@wakeadmin/element-adapter';

export interface FatFormStepSlots {
  /**
   * 自定义图标
   */
  renderIcon?: () => any;

  /**
   * 自定义标题
   */
  renderTitle?: () => any;

  /**
   * 自定义描述
   */
  renderDescription?: () => any;

  /**
   * 表单主体
   */
  renderDefault?: () => any;
}

export interface FatFormStepProps<Store extends {} = {}, Request extends {} = Store, Submit extends {} = Store>
  extends StepProps,
    FatFormStepSlots {
  /**
   * 步骤提交。在点击下一步或者提交(最后异步)时触发, 可以在这里进行一些数据验证之类的操作，如果抛出异常则终止运行。
   */
  submit?: (value: Store) => Promise<void>;
}
