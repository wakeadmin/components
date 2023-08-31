import { FilterPattern } from '@rollup/pluginutils';

export interface Options {
  include?: FilterPattern;
  exclude?: FilterPattern;
}
