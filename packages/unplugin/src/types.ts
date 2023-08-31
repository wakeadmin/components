import type { ParserOptions } from '@babel/core';
import type { FilterPattern } from '@rollup/pluginutils';

export interface Options {
  /**
   * 待处理的文件，默认 会处理 .jsx、.tsx 文件
   */
  include?: FilterPattern;
  exclude?: FilterPattern;

  /**
   * 是否开启 defineComponent 的处理，默认 false
   */
  enabledDefineComponent?: boolean;

  /**
   * babel parser 插件，默认 ['jsx']
   * 如果是 tsx 文件，会加上 typescript
   */
  parserPlugins?: ParserOptions['plugins'];

  /**
   * 调试模式
   */
  debug?: boolean;
}
