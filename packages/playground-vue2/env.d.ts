declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// element-ui 类型基本上是残废的，无法正常推断类型
// 这里因为冲突才使用 '@vue/runtime-core', 正式的应该使用 vue 模块
declare module '@vue/runtime-core' {
  import element from 'element-ui';

  type TypeofElementExpose = typeof element;
  type KeyOfElementExpose = keyof TypeofElementExpose;
  type KeyofComponent = Exclude<KeyOfElementExpose, 'version' | 'install'>;

  type ElementComponents = {
    [K in KeyofComponent as `El${K}`]: TypeofElementExpose[K];
  };

  export interface GlobalComponents extends ElementComponents {
    RouterView: typeof import('vue-router').RouterView;
  }
}

// CSS modules
interface CSSModuleClasses {
  readonly [key: string]: string;
}

declare module '*.module.css' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.scss' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.sass' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.less' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.styl' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.stylus' {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module '*.module.pcss' {
  const classes: CSSModuleClasses;
  export default classes;
}

// 翻译文件
declare module '*.tr' {
  export default object;
}

// CSS
declare module '*.css' {
  const css: string;
  export default css;
}
declare module '*.scss' {
  const css: string;
  export default css;
}
declare module '*.sass' {
  const css: string;
  export default css;
}
declare module '*.less' {
  const css: string;
  export default css;
}
declare module '*.styl' {
  const css: string;
  export default css;
}
declare module '*.stylus' {
  const css: string;
  export default css;
}
declare module '*.pcss' {
  const css: string;
  export default css;
}

// Built-in asset types
// see `src/constants.ts`

// images
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.jfif' {
  const src: string;
  export default src;
}
declare module '*.pjpeg' {
  const src: string;
  export default src;
}
declare module '*.pjp' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.gif' {
  const src: string;
  export default src;
}
declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*.ico' {
  const src: string;
  export default src;
}
declare module '*.webp' {
  const src: string;
  export default src;
}
declare module '*.avif' {
  const src: string;
  export default src;
}

// media
declare module '*.mp4' {
  const src: string;
  export default src;
}
declare module '*.webm' {
  const src: string;
  export default src;
}
declare module '*.ogg' {
  const src: string;
  export default src;
}
declare module '*.mp3' {
  const src: string;
  export default src;
}
declare module '*.wav' {
  const src: string;
  export default src;
}
declare module '*.flac' {
  const src: string;
  export default src;
}
declare module '*.aac' {
  const src: string;
  export default src;
}

// fonts
declare module '*.woff' {
  const src: string;
  export default src;
}
declare module '*.woff2' {
  const src: string;
  export default src;
}
declare module '*.eot' {
  const src: string;
  export default src;
}
declare module '*.ttf' {
  const src: string;
  export default src;
}
declare module '*.otf' {
  const src: string;
  export default src;
}

// other
declare module '*.wasm?init' {
  const initWasm: (options: WebAssembly.Imports) => Promise<WebAssembly.Instance>;
  export default initWasm;
}
declare module '*.webmanifest' {
  const src: string;
  export default src;
}
declare module '*.pdf' {
  const src: string;
  export default src;
}
declare module '*.txt' {
  const src: string;
  export default src;
}
