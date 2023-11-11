import { defineFatTable } from '@wakeadmin/components';

interface T {
  id: number;
  name: string;
  age: number;
  address: string;
}

export default defineFatTable<T>(({ column, p }) => {
  return () => {
    return {
      async request() {
        return {
          total: 100,
          list: new Array(100).fill(0).map((_, index) => ({
            id: index,
            name: 'name' + index,
            age: index,
            address: 'address' + index,
          })),
        };
      },
      columns: [
        column({
          prop: p('name'),
          label: '名称',
          queryable: true,
        }),
        column({
          prop: p('address'),
          label: '地址',
          queryable: true,
        }),
      ],
      // 自定义表格渲染
      renderTable(scope) {
        return (
          <div>
            {scope.list.map(item => {
              return (
                <div key={item.id}>
                  {item.name} - {item.address}
                </div>
              );
            })}
          </div>
        );
      },
    };
  };
});
