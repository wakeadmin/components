import { defineFatFormModal } from '@wakeadmin/components';
import { watch } from 'vue';

export default defineFatFormModal(({ form, item }) => {
  watch(
    () => form.value?.values,
    () => {
      console.log('form values changed');
    },
    { deep: true }
  );

  const handleClose = () => {
    form.value?.close();
    console.log(form.value?.values);
  };

  return () => ({
    title: 'hello',
    class: 'hello',
    initialValue: {
      a: 1,
      b: 2,
    },
    children: [
      item({ label: 'A', prop: 'a' }),
      <div>
        <button onClick={handleClose}>hide</button>
        {JSON.stringify(form.value?.values)}
      </div>,
    ],
  });
});
