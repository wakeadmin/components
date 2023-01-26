<template>
  <div style="padding-bottom: 300px">
    <div>
      <h4>基本操作</h4>
      <FatDragItem class="inline-block">
        <span> 愿天上人间，占得欢娱 </span>
      </FatDragItem>
    </div>
    <div>
      <h4>自定义触发元素</h4>
      <FatDragItem class="inline-block">
        <FatDragHandler class="handler"> 🐇 </FatDragHandler>
        <span>点火樱桃，照一架、荼蘼如雪 </span>
      </FatDragItem>
    </div>
    <div>
      <h4>限制位移</h4>
      <FatDragItem class="inline-block" lock-axis="x">
        <FatDragHandler class="handler"> 🦌 - X </FatDragHandler>
        <span>落花人独立 </span>
      </FatDragItem>
      <FatDragItem class="inline-block" lock-axis="y">
        <FatDragHandler class="handler"> 🐟 - Y </FatDragHandler>
        <span>微雨燕双飞 </span>
      </FatDragItem>
    </div>

    <div>
      <h4>禁用拖拽</h4>
      <div>
        <el-button @click="toggleAllowDrag">切换状态</el-button>
      </div>
      <FatDragItem class="inline-block cursor-move" :class="{ disabled: allowDrag }" :disabled="allowDrag">
        <span> 始围寸而高尺，今连拱而九成 </span>
      </FatDragItem>
    </div>
    <div>
      <h4>列表排序</h4>
      <FatDropList :data="dataSource1" class="list" @dropped="move($event, 0)">
        <FatDragItem v-for="item of dataSource1" :key="item" class="inline-block w-300" :data="item">
          <span> {{ item }} </span>
        </FatDragItem>
      </FatDropList>
    </div>
    <div>
      <h4>列表排序 - 水平</h4>
      <FatDropList :data="dataSource2" class="list row" orientation="horizontal" @dropped="move($event, 1)">
        <FatDragItem v-for="item of dataSource2" :key="item" class="inline-block w-300" :data="item">
          <span> {{ item }} </span>
        </FatDragItem>
      </FatDropList>
    </div>
    <div>
      <h4>列表排序 - 禁用</h4>
      <div>
        <el-button @click="toggleAllowDrag">切换状态</el-button>
      </div>
      <FatDropList :data="[]" class="list" :disabled="allowDrag" @dropped="move($event, 2)">
        <FatDragItem v-for="item of dataSource3" :key="item" class="inline-block w-300">
          <span> {{ item }} </span>
        </FatDragItem>
      </FatDropList>
    </div>
    <div>
      <h4>列表排序 - 自定义预览</h4>
      <FatDropList :data="[]" class="list" @dropped="move($event, 3)">
        <FatDragItem v-for="item of dataSource4" :key="item.name" class="inline-block w-300" :data="item">
          <span> {{ item.name }} </span>
        </FatDragItem>
        <template #preview="{ cover }">
          <picture class="cover">
            <img :src="cover" />
          </picture>
        </template>
      </FatDropList>
    </div>
    <div>
      <h4>列表排序 - 自定义占位</h4>
      <el-alert class="w-300">
        这里使用了自定义占位 默认的情况下 只有鼠标在容器附近才会进行排序 我们可以将这个基准值设大一些
      </el-alert>
      <FatDropList :data="[]" class="list custom-drop-list" :drop-sort-threshold="1" @dropped="move($event, 3)">
        <FatDragItem v-for="item of dataSource4" :key="item.name" class="inline-block w-300" :data="item">
          <span> {{ item.name }} </span>
        </FatDragItem>
        <template #placeholder="{ cover }">
          <picture class="cover">
            <img :src="cover" />
          </picture>
        </template>
      </FatDropList>
    </div>
    <div>
      <h4>列表组 - FatDropListGroup</h4>
      <FatDropListGroup class="drop-group">
        <FatDropList class="list drop-item" :data="dataSource5">
          <FatDragItem
            v-for="item of dataSource5"
            :key="item"
            class="inline-block w-300"
            :data="item"
            @dropped="dropListGroupDropHandler"
          >
            <span> {{ item }} </span>
          </FatDragItem>
        </FatDropList>
        <FatDropList class="list drop-item" :data="dataSource6">
          <FatDragItem
            v-for="item of dataSource6"
            :key="item"
            class="inline-block w-300"
            :data="item"
            @dropped="dropListGroupDropHandler"
          >
            <span> {{ item }} </span>
          </FatDragItem>
        </FatDropList>
      </FatDropListGroup>
    </div>
    <div>
      <h4>列表组 - connectTo</h4>
      <el-alert class="w-300"> 左边的无法进入右边的 但是右边能进入左边 </el-alert>
      <div class="drop-group">
        <FatDropList ref="dropListRef1" class="list drop-item">
          <FatDragItem
            v-for="item of dataSource5"
            :key="item"
            class="inline-block w-300"
            :data="item"
            @dropped="dropListGroupDropHandler"
          >
            <span> {{ item }} </span>
          </FatDragItem>
        </FatDropList>
        <FatDropList class="list drop-item" :connect-to="connectTo">
          <FatDragItem
            v-for="item of dataSource6"
            :key="item"
            class="inline-block w-300"
            :data="item"
            @dropped="dropListGroupDropHandler"
          >
            <span> {{ item }} </span>
          </FatDragItem>
        </FatDropList>
      </div>
    </div>
    <div>
      <h4>列表组 - 是否允许进入</h4>
      <el-alert class="w-300"> 只有左边的 町、時の流れ、人 能拖进去 </el-alert>
      <FatDropListGroup class="drop-group">
        <FatDropList
          :data="dataSource5"
          class="list drop-item"
          :enter-predicate="enterPredicate"
          @dropped="dropListGroupDropHandler"
        >
          <FatDragItem v-for="item of dataSource5" :key="item" class="inline-block w-300" :data="item">
            <span> {{ item }} </span>
          </FatDragItem>
        </FatDropList>
        <FatDropList
          :data="dataSource6"
          class="list drop-item"
          :enter-predicate="enterPredicate"
          @dropped="dropListGroupDropHandler"
        >
          <FatDragItem v-for="item of dataSource6" :key="item" class="inline-block w-300" :data="item">
            <span> {{ item }} </span>
          </FatDragItem>
        </FatDropList>
      </FatDropListGroup>
    </div>
  </div>
</template>
<script setup>
  import {
    FatDragItem,
    FatDragHandler,
    FatDropList,
    moveItemInRefArray,
    FatDropListGroup,
    transferArrayItem,
  } from '@wakeadmin/components';
  import { computed, ref } from 'vue';

  const dropListRef1 = ref();
  const connectTo = computed(() => [dropListRef1.value?.instance].filter(val => !!val));
  const allowDrag = ref(false);
  const toggleAllowDrag = () => {
    allowDrag.value = !allowDrag.value;
  };
  const dataSource1 = ref([
    '蘅皋向晚舣轻航',
    '卸云帆、水驿鱼乡',
    '当暮天、霁色如晴画',
    '江练静、皎月飞光',
    '那堪听、远村羌管，引离人断肠',
    '此际浪萍风梗，度岁茫茫',
    '堪伤',
    '朝欢暮宴，被多情、赋与凄凉',
    '别来最苦，襟袖依约，尚有馀香',
    '算得伊、鸳衾凤枕，夜永争不思量',
    '牵情处，惟有临歧，一句难忘',
  ]);
  const dataSource2 = ref(['明月如霜', '好风如水', '清景无限', '曲港跳鱼']);

  const dataSource3 = ref([
    '桐风惊心壮士苦',
    '衰灯络纬啼寒素',
    '谁看青简一编书',
    '不遣花虫粉空蠹',
    '思牵今夜肠应直',
    '雨冷香魂吊书客',
    '秋坟鬼唱鲍家诗',
    '恨血千年土中碧',
  ]);

  const dataSource4 = ref([
    {
      name: 'Rain',
      cover: require('./imgs/1.jpg'),
    },
    {
      name: '月 ~Main Theme',
      cover: require('./imgs/2.jpg'),
    },
    {
      name: 'It through all eternity',
      cover: require('./imgs/3.jpg'),
    },
    {
      name: '真紅の翼',
      cover: require('./imgs/4.jpg'),
    },
    {
      name: '王都アウルリウム',
      cover: require('./imgs/5.jpg'),
    },
    {
      name: '久遠寺有珠',
      cover: require('./imgs/6.jpg'),
    },
  ]);

  const dataSource5 = ref([
    '町、時の流れ、人',
    'nostalgia',
    'Dearly Beloved',
    '蒼崎青子',
    '谁が为に',
    'Sorrow',
    "Dead's dream",
  ]);
  const dataSource6 = ref([
    'グーラ領/森林',
    'ザナルカンドにて',
    'The Final Battle',
    'Blood Upon the Snow',
    'Old Soldiers Die Hard',
    'Lost Again',
    'I Really Want to Stay At Your House',
  ]);

  const enterPredicate = drag => {
    return drag.data === '町、時の流れ、人';
  };
  const sourceList = [dataSource1, dataSource2, dataSource3, dataSource4];
  const move = (obj, index) => {
    moveItemInRefArray(sourceList[index], obj.previousIndex, obj.currentIndex);
  };

  const dropListGroupDropHandler = event => {
    const { container, previousContainer, previousIndex, currentIndex } = event;
    if (container !== previousContainer) {
      transferArrayItem(previousContainer.data, container.data, previousIndex, currentIndex);
    } else {
      moveItemInRefArray(container.data, previousIndex, currentIndex);
    }
  };
</script>
<!-- eslint-disable-next-line wkvue/no-style-scoped -->
<style lang="scss">
  .inline-block {
    display: inline-block;
    background: #fff;
    padding: 6px 12px;
    box-sizing: border-box;
  }
  .handler {
    display: inline;
    padding: 6px;
  }
  .list {
    display: flex;
    flex-direction: column;
    width: max-content;
    margin-left: 10vw;
    margin-top: 12px;
    &.row {
      flex-direction: row;

      .inline-block + .inline-block {
        border: 1px solid #ccc;
        border-left: none;
      }
    }
    .inline-block {
      border: 1px solid #ccc;
    }
    .inline-block + .inline-block {
      border-top: none;
    }
  }

  .w-300 {
    width: 300px;
  }
  .cursor-move {
    cursor: move;
  }
  .disabled {
    cursor: not-allowed;
  }
  .cover {
    display: inline-block;
    width: 130px;
    height: 130px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .custom-drop-list .fat-drag-placeholder {
    opacity: 1;
  }
  .drop-group {
    display: flex;
  }
  .drop-item {
    margin-bottom: 3vw;
  }
</style>
