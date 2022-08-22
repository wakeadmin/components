import { InjectionKey } from '@wakeadmin/demi';

import { FatFormMethods } from './types';

export const FatFormContext: InjectionKey<FatFormMethods<any>> = Symbol('fat-form-context');
