import { InjectionKey } from '@wakeadmin/demi';

import { FatFormItemInheritableProps, FatFormMethods } from './types';

export const FatFormContext: InjectionKey<FatFormMethods<any>> = Symbol('fat-form-context');

export const FatFormInheritanceContext: InjectionKey<FatFormItemInheritableProps> =
  Symbol('fat-form-inheritance-context');
