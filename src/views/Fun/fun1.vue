<script lang='ts'>
import { ref, defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();

    // Dom
    const fun1FromRef = ref();

    // 目前下拉的選項
    const selectIndex = ref('');

    // 下拉的選項
    const selectOptions = computed(() => store.getters['fun1/investmentNo']);

    // 決定欄位是否顯示
    const isVisible = computed(() => store.getters['fun1/displayData']);

    const onChange = () => {
      console.log('selectIndex => ', selectIndex.value);
      store.dispatch('fun1/setupView', selectIndex.value);
    };

    return {
      fun1FromRef,
      isVisible,
      selectIndex,
      selectOptions,
      onChange,
    };
  },
});
</script>

<template>

  <el-form ref="fun1FromRef"
           class="fun1-main">
    <el-select v-model="selectIndex"
               placeholder="請選擇投資案號"
               @change="onChange">
      <el-option v-for="item in selectOptions"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
    <el-form-item prop="id"
                  label="身分證號"
                  v-show="isVisible.idShow">
      <el-input type="text"
                placeholder="請輸入身分證號"></el-input>
    </el-form-item>
    <el-form-item prop="name"
                  label="姓名"
                  v-show="isVisible.nameShow">
      <el-input type="text"
                placeholder="請輸入姓名"></el-input>
    </el-form-item>
    <el-form-item prop="address"
                  label="地址"
                  v-show="isVisible.addressShow">
      <el-input type="text"
                placeholder="請輸入地址"></el-input>
    </el-form-item>
    <el-form-item prop="mobile"
                  label="手機號碼"
                  v-show="isVisible.mobileShow">
      <el-input type="text"
                placeholder="請輸入手機號碼"></el-input>
    </el-form-item>
    <el-form-item prop="age"
                  label="年齡"
                  v-show="isVisible.ageShow">
      <el-input type="text"
                placeholder="請輸入年齡"></el-input>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
@import '@/style/variable.scss';
</style>