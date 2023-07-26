# FatImageVerification 图形验证码 (试验)

简单的图形验证码

<br>
<br>
<br>

## 示例

<ClientOnly>
	<div class="wk-demo">
		<FatImageVerification
			:request="requestMetadata"
			:canvas="canvasConfig"
			:clip="clipConfig"
			@change="handleChange"
		 />
		 <div>value: {{value}}</div>
	</div>
</ClientOnly>

<script lang="ts" setup>
	import { FatImageVerification, FatImageVerificationProps } from '@wakeadmin/components'
	import { delay } from '@wakeadmin/utils';
	import {ref} from 'vue'

	const value = ref(0)

	// 可选, 默认 350 * 150
	const canvasConfig = {
		width: 340, height: 212
	}

	// 切片大小，默认根据传入的图片设置
	const clipConfig = {
		width: 65, height: 65
	}

	const handleChange: FatImageVerificationProps['onChange'] = (v) => {
		value.value = v.value
	}

	const requestMetadata: FatImageVerificationProps['request'] = async () => {
		await delay(1000)
		return {
			backgroundImage: 'https://p6-catpcha.byteimg.com/tos-cn-i-188rlo5p4y/59fa6e86e09245a9b73e900d35e92739~tplv-188rlo5p4y-2.jpeg',
			clipImage: 'https://p6-catpcha.byteimg.com/tos-cn-i-188rlo5p4y/c9958e6b691049949147d62c691e0a4c~tplv-188rlo5p4y-1.png',
			y: 114
		}
	}
</script>

::: details 查看代码

```vue
<template>
  <div class="wk-demo">
    <FatImageVerification :request="requestMetadata" :canvas="canvasConfig" :clip="clipConfig" @change="handleChange" />
    <div>value: {{ value }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { FatImageVerification, FatImageVerificationProps } from '@wakeadmin/components';
  import { delay } from '@wakeadmin/utils';
  import { ref } from 'vue';

  const value = ref(0);

  // 可选, 默认 350 * 150
  const canvasConfig = {
    width: 340,
    height: 212,
  };

  // 切片大小，默认根据传入的图片设置
  const clipConfig = {
    width: 65,
    height: 65,
  };

  const handleChange: FatImageVerificationProps['onChange'] = v => {
    value.value = v.value;
  };

  const requestMetadata: FatImageVerificationProps['request'] = async () => {
    await delay(1000);
    return {
      backgroundImage:
        'https://p6-catpcha.byteimg.com/tos-cn-i-188rlo5p4y/59fa6e86e09245a9b73e900d35e92739~tplv-188rlo5p4y-2.jpeg',
      clipImage:
        'https://p6-catpcha.byteimg.com/tos-cn-i-188rlo5p4y/c9958e6b691049949147d62c691e0a4c~tplv-188rlo5p4y-1.png',
      y: 114,
    };
  };
</script>
```

:::
