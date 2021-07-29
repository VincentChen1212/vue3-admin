<script lang="ts">
import { computed, defineComponent, onBeforeMount } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();

    const invList = computed(() => store.getters['investor/list']);
    const invDetail = computed(() => store.getters['investor/detail']);

    const columnArray = [
      { prop: 'id', label: '身分證號', width: '150' },
      { prop: 'name', label: '姓名', width: '100' },
      { prop: 'sex', label: '性別', width: '80' },
      { prop: 'age', label: '年齡', width: '80' },
      { prop: 'married', label: '婚姻狀態', width: '100' },
      { prop: 'height', label: '身高', width: '80' },
      { prop: 'weight', label: '體重', width: '80' },
    ];

    onBeforeMount(() => {
      store.dispatch('investor/getList');

      // console.log('invList => ', invList);
    });

    const handExpandChange = (row: any, expandedRows: Array<any>) => {
      // console.log('row => ', row);
      // console.log('row type => ', row.constructor);
      // console.log('expandedRows type => ', expandedRows.constructor);

      const id = row.id;
      console.log('cid => ', id);
    };

    const handDetail = (id: string) => {
      console.log('handDetail id => ', id);

      /** 目前因為不想動我測試API，所以暫時這樣處理 **/
      store.dispatch('investor/getDetail', id).then(() => {
        const birthPlace = invDetail.value.birthPlace;
        const name = invDetail.value.name;

        const config = {
          title: `該投資者 ${name} 的出生地是：`,
          message: `${birthPlace}`,
        };
        store.dispatch('toggleDialog', {
          flag: true,
          config,
        });
      });
    };

    return { columnArray, invList, invDetail, handExpandChange, handDetail };
  },
});
</script>

<template>
  <el-table v-if="invList.length > 0"
            :data="invList"
            :default-sort="{ prop: 'id', order: 'ascending' }"
            stripe
            highlight-current-row
            style="width: 100%"
            @expand-change="handExpandChange">

    <el-table-column type="expand">
      <template #default="props">
        <h1>職稱：{{ props.row.title }}</h1>
        <h1>出生地：{{ props.row.birthPlace }}</h1>
      </template>
    </el-table-column>

    <el-table-column v-for="column in columnArray"
                     :key="column"
                     :prop="column.prop"
                     :label="column.label"
                     :sortable="column.prop === 'id' ? true : false"
                     :width="column.width">
    </el-table-column>

    <el-table-column label="功能"
                     align="center">
      <template #default="scope">
        <el-button @click.prevent="handDetail(scope.row.id)"
                   size="small"
                   plain>資訊
        </el-button>
        <el-button @click.prevent="handDetail(scope.row.serial)"
                   type="info"
                   size="small"
                   plain>編輯
        </el-button>
        <el-button @click.prevent="handDetail(scope.row.serial)"
                   type="danger"
                   size="small"
                   plain>刪除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- <h1 v-if="invDetail.cid">{{ invDetail }}</h1> -->
</template>

<style lang="scss" scoped>
@import '@/style/variable.scss';
</style>
