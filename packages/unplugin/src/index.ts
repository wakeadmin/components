import { createHash } from 'node:crypto';
import { UnpluginFactory, createUnplugin } from 'unplugin';
import { createFilter } from '@rollup/pluginutils';
import type { Options } from './types';
import babel, { PluginObj } from '@babel/core';

const PLUGIN_NAME = 'unplugin-wakeadmin-components';
const t = babel.types;

const DEFINE_FACTORIES = new Set(['defineFatTable', 'defineFatForm']);
const DEFAULT_LOCAL_NAME = '__default__';

function isDefineCall(node: babel.types.CallExpression) {
  return t.isIdentifier(node.callee) && DEFINE_FACTORIES.has(node.callee.name);
}

function getHash(text: string) {
  return createHash('sha256').update(text).digest('hex').substring(0, 8);
}

interface HotComponent {
  local: string;
  exported: string;
  id: string;
}

function patchHotComponents(hotComponents: HotComponent[], framework: 'vite' | 'webpack', id: string): string {
  let hmrCode = '';
  let callbackCode = '';

  for (const c of hotComponents) {
    hmrCode +=
      `\nif (typeof __VUE_HMR_RUNTIME__ !== 'undefined') {\n` +
      `${c.local}.__hmrId = '${c.id}'` +
      `\n __VUE_HMR_RUNTIME__.createRecord('${c.id}', ${c.local})\n}`;

    callbackCode += `\n__VUE_HMR_RUNTIME__.reload("${c.id}", __${c.exported})`;
  }

  if (framework === 'vite') {
    hmrCode += `\nif (import.meta.hot) {
  import.meta.hot.accept(({${hotComponents
    .map(c => `${c.exported}: __${c.exported}`)
    .join(',')}}) => {${callbackCode}\n})
}`;
  } else {
    // webpack
    hmrCode += `\nif (module.hot) {
  module.hot.accept()
  if (module.hot.status() !== 'idle') {
    console.log('hot reload: ${id}')
    const {${hotComponents.map(c => `${c.exported}: __${c.exported}`).join(', ')}} = __webpack_module__.exports
    ${callbackCode}
  }
}`;
  }

  return hmrCode;
}

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options, meta) => {
  const filter = createFilter(options?.include || /\.[jt]sx$/, options?.exclude);
  let isWebpack = meta.framework === 'webpack';
  let isVite = meta.framework === 'vite';
  const enabled = process.env.NODE_ENV === 'development' && (isWebpack || isVite);

  if (!enabled) {
    return {
      name: PLUGIN_NAME,
    };
  }

  return {
    name: PLUGIN_NAME,
    enforce: 'pre',
    transformInclude(id) {
      const [filepath] = id.split('?');

      return filter(id) || filter(filepath);
    },
    transform(code, id) {
      const hotComponents: HotComponent[] = [];

      const result = babel.transformSync(code, {
        sourceFileName: id,
        sourceMaps: true,
        babelrc: false,
        configFile: false,
        plugins: [
          () => {
            return {
              visitor: {
                // 为 define* 添加 PURE, 支持被 tree-shaking
                CallExpression(path) {
                  if (isDefineCall(path.node)) {
                    path.get('callee').addComment('leading', '#__PURE__');
                  }
                },
                ExportNamedDeclaration(path) {
                  if (path.node.declaration && t.isVariableDeclaration(path.node.declaration)) {
                    // export const xxx = defineXXX() 形式
                    const declarations = path.node.declaration.declarations;
                    for (const decl of declarations) {
                      if (
                        t.isIdentifier(decl.id) &&
                        decl.init &&
                        t.isCallExpression(decl.init) &&
                        isDefineCall(decl.init)
                      ) {
                        hotComponents.push({
                          local: decl.id.name,
                          exported: decl.id.name,
                          id: getHash(id + decl.id.name),
                        });
                      }
                    }
                  } else if (path.node.specifiers) {
                    // export { xxx } 形式
                    const specifiers = path.node.specifiers;
                    for (const spec of specifiers) {
                      if (t.isExportSpecifier(spec)) {
                        const binding = path.scope.getBinding(spec.local.name);
                        if (
                          binding &&
                          t.isVariableDeclarator(binding.path.node) &&
                          t.isCallExpression(binding.path.node.init) &&
                          isDefineCall(binding.path.node.init)
                        ) {
                          const exported = t.isIdentifier(spec.exported) ? spec.exported.name : spec.exported.value;
                          hotComponents.push({
                            local: spec.local.name,
                            exported,
                            id: getHash(id + exported),
                          });
                        }
                      }
                    }
                  }
                },
                ExportDefaultDeclaration(path) {
                  // export default defineXXX() 形式
                  const declaration = path.node.declaration;
                  if (t.isCallExpression(declaration) && isDefineCall(declaration)) {
                    hotComponents.push({
                      local: DEFAULT_LOCAL_NAME,
                      exported: 'default',
                      id: getHash(id + 'default'),
                    });

                    // 修改 export default
                    const variable = t.variableDeclaration('const', [
                      t.variableDeclarator(t.identifier(DEFAULT_LOCAL_NAME), declaration),
                    ]);
                    const exportDefault = t.exportDefaultDeclaration(t.identifier(DEFAULT_LOCAL_NAME));

                    path.replaceWithMultiple([variable, exportDefault]);
                  }
                },
              },
            } as PluginObj;
          },
        ],
        parserOpts: {
          plugins: ['jsx', 'typescript'],
        },
      });

      if (result?.code == null) {
        return null;
      }

      if (hotComponents.length !== 0) {
        const hmrCode = patchHotComponents(hotComponents, meta.framework as 'vite' | 'webpack', id);
        result.code = result.code + hmrCode;

        console.log(result.code);
      }

      return {
        code: result.code,
        map: result?.map,
      };
    },
  };
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
