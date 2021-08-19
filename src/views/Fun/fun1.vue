<script lang='ts'>
import { ref, defineComponent, computed, onBeforeMount } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();

    // Dom
    const fieldFormRef = ref(); // 動態欄位下拉區
    const linkFormRef = ref(); // 連動下拉區

    // 目前下拉的選項
    const fieldSelectModel = ref(''); // 動態欄位下拉
    const linkSelectModel1 = ref(''); // 連動下拉Level1
    const linkSelectModel2 = ref(''); // 連動下拉Level2

    // 動態欄位下拉的選項
    const fieldSelectOptions = computed(() => store.getters['fun1/investmentNo']);

    // 決定欄位是否顯示
    const fieldVisible = computed(() => store.getters['fun1/displayData']);

    // 城市的選項
    const cityOptions = computed(() => store.getters['fun1/cityList']);

    // 鄉鎮市區的選項
    const distOptions = computed(() => store.getters['fun1/distList']);

    // 顯示選擇的城市與鄉鎮市區
    const showAddress = ref('');

    onBeforeMount(() => store.dispatch('fun1/getCityList'));

    const onFieldChange = () => {
      // console.log('fieldSelectModel => ', fieldSelectModel.value);
      store.dispatch('fun1/setupView', fieldSelectModel.value);
    };

    const _showResult = () => {
      showAddress.value = `${linkSelectModel1.value} - ${linkSelectModel2.value}`;
    };

    const showResult = () => {
      setTimeout(_showResult, 1);
    };

    // 選擇城市後，重置鄉鎮市區
    // ref：https://developpaper.com/question/how-can-select-in-element-clear-the-previous-selection-after-the-drop-down-data-changes/
    const resetDist = async () => {
      linkSelectModel2.value = await '';
    };

    const onLinkChange1 = () => {
      resetDist();
      store.dispatch('fun1/getDistrictList', linkSelectModel1.value);

      // console.log('linkSelectModel1 => ', linkSelectModel1.value);
      // console.log('linkSelectModel2 => ', linkSelectModel2.value);

      // showResult();
    };

    const onLinkChange2 = () => {
      // console.log('linkSelectModel1 => ', linkSelectModel1.value);
      // console.log('linkSelectModel2 => ', linkSelectModel2.value);
      // showResult();
    };

    const submit = () => {
      _showResult();
    };

    return {
      fieldFormRef,
      fieldSelectModel,
      fieldSelectOptions,
      fieldVisible,
      onFieldChange,

      linkFormRef,
      linkSelectModel1,
      cityOptions,
      onLinkChange1,
      linkSelectModel2,
      distOptions,
      onLinkChange2,

      showAddress,
      submit,
    };
  },
});
</script>

<template>

  <el-form ref="fieldFormRef"
           class="fun1-main">
    <el-select v-model="fieldSelectModel"
               placeholder="請選擇投資案號"
               @change="onFieldChange">
      <el-option v-for="item in fieldSelectOptions"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
    <el-form-item prop="id"
                  label="身分證號"
                  v-show="fieldVisible.idShow">
      <el-input type="text"
                placeholder="請輸入身分證號"></el-input>
    </el-form-item>
    <el-form-item prop="name"
                  label="姓名"
                  v-show="fieldVisible.nameShow">
      <el-input type="text"
                placeholder="請輸入姓名"></el-input>
    </el-form-item>
    <el-form-item prop="address"
                  label="地址"
                  v-show="fieldVisible.addressShow">
      <el-input type="text"
                placeholder="請輸入地址"></el-input>
    </el-form-item>
    <el-form-item prop="mobile"
                  label="手機號碼"
                  v-show="fieldVisible.mobileShow">
      <el-input type="text"
                placeholder="請輸入手機號碼"></el-input>
    </el-form-item>
    <el-form-item prop="age"
                  label="年齡"
                  v-show="fieldVisible.ageShow">
      <el-input type="text"
                placeholder="請輸入年齡"></el-input>
    </el-form-item>
  </el-form>

  <hr>

  <el-form ref="linkFormRef">
    <el-select v-model="linkSelectModel1"
               placeholder="請選擇城市"
               @change="onLinkChange1">
      <el-option v-for="item in cityOptions"
                 :key="item"
                 :label="item.name"
                 :value="item.name">
      </el-option>
    </el-select>
    &nbsp;&nbsp;|&nbsp;&nbsp;
    <el-select v-model="linkSelectModel2"
               placeholder="請選擇鄉鎮市區"
               @change="onLinkChange2"
               :disabled="!distOptions.name">
      <el-option v-for="item in distOptions.districts"
                 :key="item"
                 :label="item.name"
                 :value="item.zip">
      </el-option>
    </el-select>
    &nbsp;&nbsp;|&nbsp;&nbsp;
    <el-button type="info"
               plain
               @click="submit">結果送出</el-button>
    <h1>{{showAddress}}</h1>
  </el-form>
</template>

<style lang="scss" scoped>
@import '@/style/variable.scss';
</style>