<script lang="ts">
import { computed, defineComponent, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import ItemModal from './itemModal.vue';

export default defineComponent({
  components: {
    ItemModal,
  },

  setup() {
    const store = useStore();

    const invList = computed(() => store.getters['investor/list']);
    const invDetail = computed(() => store.getters['investor/detail']);

    const columnArray = [
      { prop: 'id', label: '身分證號', width: '150' },
      { prop: 'name', label: '姓名', width: '100' },
      { prop: 'sexString', label: '性別', width: '80' },
      { prop: 'age', label: '年齡', width: '80' },
      { prop: 'marriedString', label: '婚姻狀態', width: '100' },
      { prop: 'height', label: '身高', width: '80' },
      { prop: 'weight', label: '體重', width: '80' },
    ];

    onBeforeMount(() => {
      store.dispatch('investor/getList');
      // console.log('invList => ', invList);
    });

    // Table 展開
    const handExpandChange = (row: any) => {
      // console.log('row => ', row);
      // console.log('row type => ', row.constructor);
      // console.log('expandedRows type => ', expandedRows.constructor);

      const id = row.id;
      console.log('cid => ', id);
    };

    // 新增按鈕
    const addData = () => {
      store.dispatch('investor/toggleModal', {
        flag: true,
        config: { type: 'add' },
      });
    };

    // 編輯按鈕
    const updateData = (serial: string) => {
      // console.log('update => ', invList.value[index]);
      // console.log('index ===>>>', serial);

      // 不能直接使用 Index，因為 Table 有排序，會打亂其原始排序
      const filterData = invList.value.filter((it: any) => it.serial === serial);
      // console.log('filterData ===>>>', filterData);

      store.dispatch('investor/toggleModal', {
        flag: true,
        config: { type: 'edit' },
        data: { ...filterData[0] },
      });
    };

    // 刪除按鈕
    const deleteData = (serial: string) => {
      // 不能直接使用 Index，因為 Table 有排序，會打亂其原始排序
      const filterData = invList.value.filter((it: any) => it.serial === serial);
      console.log('filterData ===>>>', filterData);

      const config = {
        title: '確定要刪除嗎？',
        message: `確定要刪除：${filterData[0].name}`,
        confirmCallback: () => {
          store.dispatch('investor/delete', filterData[0].serial);
        },
      };

      // Show Dialog
      store.dispatch('toggleDialog', {
        flag: true,
        config,
      });
    };

    // 資訊按鈕
    const getDetail = (id: string) => {
      // console.log('handDetail id => ', id);

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

    return { columnArray, invList, invDetail, handExpandChange, addData, updateData, deleteData, getDetail };
  },
});
</script>

<template>
  <h1 class="title">投資者列表</h1>
  <el-button class="add-btn"
             @click.prevent="addData()"
             type="primary"
             size="small"
             plain>新增
  </el-button>

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
        <el-button @click.prevent="getDetail(scope.row.id)"
                   size="small"
                   plain>資訊
        </el-button>
        <el-button @click.prevent="updateData(scope.row.serial)"
                   type="info"
                   size="small"
                   plain>編輯
        </el-button>
        <el-button @click.prevent="deleteData(scope.row.serial)"
                   type="danger"
                   size="small"
                   plain>刪除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <ItemModal />
</template>

<style lang="scss" scoped>
@import '@/style/variable.scss';

.title {
  @extend %page-title-style;
  margin-bottom: 20px;
}

.add-btn {
  margin-bottom: 20px;
}
</style>
