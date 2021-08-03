<script lang='ts'>
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();

    const isModalShow = computed(() => store.getters['investor/isModalShow']);
    const modalConfig = computed(() => store.getters['investor/modalConfig']);

    // Dom
    const invFromRef = ref();

    // 驗證規則
    const invFormRules = {
      id: [
        { required: true, message: '請輸入身分證號', trigger: 'blur' },
        { required: true, pattern: '^[A-Za-z]{1}[1-2]{1}[0-9]{8}$', message: '請身分證號格試錯誤', trigger: 'blur' },
      ],

      name: [{ required: true, message: '請輸入姓名', trigger: 'blur' }],

      age: [
        { required: true, message: '請輸入年齡', trigger: 'blur' },
        { required: true, type: 'integer', min: 1, message: '年齡請輸入正整數', trigger: 'blur' },
      ],

      height: [
        { required: true, message: '請輸入身高', trigger: 'blur' },
        { required: true, type: 'number', min: 1, message: '身高請輸入正數(可包含小數)', trigger: 'blur' },
      ],

      weight: [
        { required: true, message: '請輸入體重', trigger: 'blur' },
        { required: true, type: 'number', min: 1, message: '體重請輸入正數(可包含小數)', trigger: 'blur' },
      ],

      birthPlace: [{ required: true, message: '請輸入出生地', trigger: 'blur' }],

      title: [{ required: true, message: '請輸入職稱', trigger: 'blur' }],
    };

    // 表單資料
    const invForm = computed({
      get: () => store.getters['investor/modalData'],
      set: (newValue) => store.dispatch('investor/setModalDate', newValue),
    });

    // 畫面重新設定
    const resetForm = () => {
      invFromRef.value.resetFields();
      invFromRef.value.clearValidate();
    };

    // 視窗關閉
    const cancel = () => {
      store.dispatch('investor/toggleModal', { flag: false });
      resetForm();
    };

    // 視窗確認
    const confirm = () => {
      invFromRef?.value?.validate((valid: boolean) => {
        if (valid) {
          const action = modalConfig.value.type === 'add' ? 'investor/add' : 'investor/update';
          store.dispatch(action, invForm.value);
          modalConfig.value.confirmCallback();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      console.log('confirm');
    };

    return { invFromRef, modalConfig, isModalShow, invFormRules, invForm, cancel, confirm };
  },
});
</script>

<template>
  <el-dialog :title="modalConfig.type === 'add' ? '新增' : '編輯'"
             :model-value="isModalShow"
             @close="cancel"
             :width="modalConfig.width">

    <main>
      <el-form ref="invFromRef"
               class="dialog-main"
               :rules="invFormRules"
               :model="invForm">
        <el-form-item prop="id"
                      label="身分證號">
          <el-input type="text"
                    placeholder="請輸入身分證號"
                    v-model="invForm.id"></el-input>
        </el-form-item>
        <el-form-item prop="name"
                      label="姓名">
          <el-input type="text"
                    placeholder="請輸入姓名"
                    v-model="invForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="age"
                      label="年齡">
          <el-input placeholder="請輸入年齡"
                    v-model.number="invForm.age"></el-input>
        </el-form-item>
        <el-form-item prop="height"
                      label="身高">
          <el-input type="number"
                    placeholder="請輸入身高"
                    v-model.number="invForm.height"
                    class="form-control hide-arrows"></el-input>
        </el-form-item>
        <el-form-item prop="weight"
                      label="體重">
          <el-input type="number"
                    placeholder="請輸入體重"
                    v-model.number="invForm.weight"
                    class="form-control hide-arrows"></el-input>
        </el-form-item>
        <el-form-item prop="married"
                      label="已婚">
          <el-switch v-model="invForm.married"></el-switch>
        </el-form-item>
        <el-form-item prop="birthPlace"
                      label="出生地">
          <el-input type="text"
                    placeholder="請輸入出生地"
                    v-model="invForm.birthPlace"></el-input>
        </el-form-item>
        <el-form-item prop="title"
                      label="職稱">
          <el-input type="text"
                    placeholder="請輸入職稱"
                    v-model="invForm.title"></el-input>
        </el-form-item>
      </el-form>
    </main>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary"
                   @click="confirm">儲存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
@import '@/style/variable.scss';
</style>