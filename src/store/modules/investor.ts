import { Module } from 'vuex';
import { apiPostInvestor, apiGetInvestorList, apiGetInvestor, apiPutInvestor, apiDeleteInvestor } from '@/api';
import { CallAPI, tryCatch } from '@/store/helper';

const investor: Module<any, any> = {
  namespaced: true,

  state: {
    // 投資者列表
    list: [],

    // 單一投資者明細
    detail: {}
  },

  getters: {
    list: state => state.list,
    detail: state => state.detail
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
    }
  },

  mutations: {
    SET_LIST(state, data) {
      state.list = data;
      console.log('investor state.list => ', state.list);
    },

    SET_DETAIL(state, data) {
      state.detail = data;
      console.log('investor state.detail => ', state.detail);
    }
  }
};

export default investor;
