const fs = require('fs');
const path = require('path');

/**
 * 将中文语言包内嵌进去，作为默认语言
 */
function run() {
  const text = fs.readFileSync(path.resolve(process.cwd(), './locale/zh.tr'));
  fs.writeFileSync(
    path.resolve(process.cwd(), './src/locale/languages.ts'),
    `/** 自动生成 勿编辑 **/\n/* eslint-disable no-template-curly-in-string */\nexport default ${text}`,
    { flag: 'w+' }
  );
}

run();
