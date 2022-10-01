import { defineFatFormPage } from '@wakeadmin/components';
import { ElMessage, ElMessageBox } from 'element-plus';

interface User {
  id?: string;
  name?: string;
  nickName?: string;
  address?: string;
}

/**
 * 用户编辑、详情、创建页面三合一
 */
export default defineFatFormPage<User>(({ item }) => {
  const url = new URL(window.location.href);
  // 数据 id
  const id = url.searchParams.get('id');
  // 模式, detail or edit
  const type = url.searchParams.get('type') ?? 'edit';

  const mode: 'create' | 'edit' | 'detail' =
    id != null && type === 'detail' ? 'detail' : id != null ? 'edit' : 'create';

  return () => ({
    title: mode === 'create' ? '新建用户' : mode === 'detail' ? '用户详情' : '编辑用户',
    mode: mode === 'detail' ? 'preview' : 'editable',
    async request() {
      // 在这里进行数据请求
      if (id != null) {
        // 编辑或详情
        // 模拟详情
        return {
          id,
          name: 'ivan',
          nickName: '狗蛋',
          address: '广东汕尾红海湾区遮浪镇',
        };
      } else {
        // 新建
        return {};
      }
    },
    async submit() {
      // 在这里执行数据保存
    },
    onFinish() {
      // 保存成功
      ElMessage.success('保存成功');
    },

    /**
     * 支持拦截取消操作
     */
    async beforeCancel(done) {
      await ElMessageBox.confirm('确定关闭当前页面？');
      done();
    },
    children: [
      item({ label: '名称', prop: 'name', width: 'medium', rules: { required: true } }),
      item({ label: '昵称', prop: 'nickName', width: 'medium', rules: { required: true } }),
      item({ label: '地址', prop: 'address', valueType: 'textarea', width: 'huge' }),
    ],
  });
});
