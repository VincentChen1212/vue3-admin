import { Module } from 'vuex';
import { apiPostInvestor, apiGetInvestorList, apiGetInvestor, apiPutInvestor, apiDeleteInvestor } from '@/api';
import { Modal, CallAPI, tryCatch } from '@/store/helper';

// 彈跳輸入視窗
class ModalData {
  serial = '';
  id = '';
  name = '';
  age = 0;
  height = 0;
  weight = 0;
  sex = '';
  married = false;
  birthPlace = '';
  title = '';

  constructor(data: object = {}) {
    Object.assign(this, data);
  }
}

const investor: Module<any, any> = {
  namespaced: true,

  state: {
    // 投資者列表
    list: [],

    // 單一投資者明細
    detail: {},

    isModalShow: false,
    modalConfig: {},
    modalData: new ModalData()
  },

  getters: {
    list: state => state.list,
    detail: state => state.detail,

    isModalShow: state => state.isModalShow,
    modalConfig: state => state.modalConfig,
    modalData: state => state.modalData
  },

  actions: {
    // 新增投資者
    async add({ getters, commit, dispatch }, data) {
      commit('UPDATE_LOADING', { flag: true }, { root: true });
      dispatch('setCallAPI', new CallAPI('investor/add'), { root: true });

      const res = await tryCatch(apiPostInvestor)(data);
      // console.log('getList res => ', res);

      if (res) {
        // 原列表加入新資料
        dispatch('setList', [...getters.list, res]);
      }

      commit('UPDATE_LOADING', { flag: false }, { root: true });
    },

    // 取得投資者列表
    async getList({ commit, dispatch }) {
      commit('UPDATE_LOADING', { flag: true }, { root: true });
      dispatch('setCallAPI', new CallAPI('investor/getList'), { root: true });

      const res = await tryCatch(apiGetInvestorList)();
      // console.log('getList res => ', res);

      if (res) {
        dispatch('setList', res);
      }

      commit('UPDATE_LOADING', { flag: false }, { root: true });
    },

    // 取得單筆投資者
    async getDetail({ commit, dispatch }, cid) {
      commit('UPDATE_LOADING', { flag: true }, { root: true });
      dispatch('setCallAPI', new CallAPI('investor/getDetail'), { root: true });

      const res = await tryCatch(apiGetInvestor)(cid);
      // console.log('handDetail res => ', res);

      if (res) {
        commit('SET_DETAIL', res);
      }

      commit('UPDATE_LOADING', { flag: false }, { root: true });
    },

    // 更新投資者
    async update({ getters, commit, dispatch }, data) {
      commit('UPDATE_LOADING', { flag: true }, { root: true });
      dispatch('setCallAPI', new CallAPI('investor/update'), { root: true });

      const res = await tryCatch(apiPutInvestor)(data.serial, data);
      // console.log('getList res => ', res);

      if (res) {
        // 更新列表內的資料
        const newData = getters.list.map((item: { [key: string]: any }) => (item.serial === data.serial ? data : item));

        dispatch('setList', newData);
      }

      commit('UPDATE_LOADING', { flag: false }, { root: true });
    },

    // 刪除投資者
    async delete({ getters, commit, dispatch }, serial) {
      commit('UPDATE_LOADING', { flag: true }, { root: true });
      dispatch('setCallAPI', new CallAPI('investor/delete'), { root: true });

      const res = await tryCatch(apiDeleteInvestor)(serial);
      // console.log('getList res => ', res);

      if (res) {
        // 更新列表內的資料
        const newData = getters.list.filter((item: { [key: string]: any }) => item.serial !== serial);

        dispatch('setList', newData);
      }

      commit('UPDATE_LOADING', { flag: false }, { root: true });
    },

    // 因為會共用，所以提出來
    setList({ commit }, data) {
      commit('SET_LIST', data);
    },

    // 開啟或關閉彈跳輸入視窗
    toggleModal({ commit }, { flag, config, data }) {
      commit('TOGGLE_MODAL', { flag, config, data });
    },

    // 由彈跳視窗設定資料回來
    setModalDate({ commit }, data) {
      commit('SET_MODAL', data);
    }
  },

  mutations: {
    SET_LIST(state, data) {
      state.list = data.map((it: { [key: string]: any }) => {
        it.sexString = it.sex === 'M' ? '男' : '女';
        it.marriedString = it.married ? '已婚' : '未婚';
        return it;
      });
      console.log('investor state.list => ', state.list);
    },

    SET_DETAIL(state, data) {
      state.detail = data;
      console.log('investor state.detail => ', state.detail);
    },

    TOGGLE_MODAL(state, { flag, config = {}, data = {} }) {
      state.isModalShow = flag ? true : false;
      state.modalConfig = new Modal({ width: '50%', isCancelShow: false, ...config });
      state.modalData = new ModalData(data);
    },

    SET_MODAL(state, data) {
      state.modalData = new ModalData(data);
    }
  }
};

export default investor;
