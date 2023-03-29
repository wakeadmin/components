const fs = require('fs');
const path = require('path');

function run() {
  const text = fs.readFileSync(path.resolve(process.cwd(), './locale/zh.tr'));
  fs.writeFileSync(
    path.resolve(process.cwd(), './src/locale/languages.ts'),
    `/** 自动生成 勿编辑 **/\n/* eslint-disable no-template-curly-in-string */\nexport default ${text}`,
    { flag: 'w+' }
  );
}

run();
