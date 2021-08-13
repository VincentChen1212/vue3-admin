import { Module } from 'vuex';

// 動態欄位顯示情況
class DisplayData {
  idShow = false;
  nameShow = false;
  addressShow = false;
  mobileShow = false;
  ageShow = false;

  constructor(data: object = {}) {
    Object.assign(this, data);
  }
}

const fun1: Module<any, any> = {
  namespaced: true,

  state: {
    // 投資案號下拉選項(if from DB)
    investmentNo: [
      {
        value: '1',
        label: '僑'
      },
      {
        value: '2',
        label: '外'
      },
      {
        value: '3',
        label: '陸'
      },
      {
        value: '4',
        label: '陸分'
      }
    ],

    // 動態欄位顯示情況(if from DB)
    displayData: new DisplayData()
  },

  getters: {
    investmentNo: state => state.investmentNo,

    displayData: state => state.displayData
  },

  actions: {
    // 設定動態欄位
    async setupView({ commit }, data: string) {
      commit('SETUP_VIEW', data);
    }
  },

  mutations: {
    SETUP_VIEW(state, data: string) {
      switch (data) {
        case '1': // 橋
          state.displayData.idShow = false;
          state.displayData.nameShow = true;
          state.displayData.addressShow = true;
          state.displayData.mobileShow = true;
          state.displayData.ageShow = true;
          console.log('Here 1');
          break;

        case '2': // 外
          state.displayData.idShow = true;
          state.displayData.nameShow = false;
          state.displayData.addressShow = true;
          state.displayData.mobileShow = true;
          state.displayData.ageShow = true;
          console.log('Here 2');
          break;

        case '3': // 陸
          state.displayData.idShow = true;
          state.displayData.nameShow = true;
          state.displayData.addressShow = false;
          state.displayData.mobileShow = true;
          state.displayData.ageShow = true;
          console.log('Here 3');
          break;

        case '4': // 陸分
          state.displayData.idShow = true;
          state.displayData.nameShow = true;
          state.displayData.addressShow = true;
          state.displayData.mobileShow = false;
          state.displayData.ageShow = true;
          console.log('Here 4');
          break;

        default:
          state.displayData.idShow = false;
          state.displayData.nameShow = false;
          state.displayData.addressShow = false;
          state.displayData.mobileShow = false;
          state.displayData.ageShow = false;
          console.log('Here Default');
          break;
      }
    }
  }
};

export default fun1;
