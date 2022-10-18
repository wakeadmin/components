const glob = require('fast-glob');
const fs = require('fs').promises;

/**
 * 将 Vue 3 具体版本的类型导入转换为 @wakeadmin/demi
 */
async function run() {
  const list = await glob('dist/**/*.d.ts');

  await Promise.all(
    list.map(async file => {
      let content = await fs.readFile(file, 'utf8');

      content = content.replace(/import\(['"]@vue\/[a-z0-9-_]+["']\)/g, 'import("@wakeadmin/demi")');

      await fs.writeFile(file, content, 'utf8');
    })
  );
}

run();
