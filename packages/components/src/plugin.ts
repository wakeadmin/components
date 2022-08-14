import { plugin as hPlugin } from '@wakeadmin/h';
import './builtin-atomic'

export const plugin = {
  install(app: any) {
    hPlugin.install(app);
  },
};
