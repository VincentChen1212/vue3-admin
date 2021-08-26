import { Module } from 'vuex';
import { apiGetTodoList, apiDeleteTodoItem, apiPostTodoItem, apiPutTodoItem } from '@/api';
import { Modal, tryCatch, CallAPI } from '@/store/helper';
class ModalData {
  title = '';
  description = '';
  done = false;
  constructor(data: object = {}) {
    Object.assign(this, data);
  }
}

const todo: Module<any, any> = {
  namespaced: true,
  state: {
    list: [],
    isModalShow: false,
    modalConfig: {},
    modalData: new ModalData()
  },
  getters: {
    list: state => state.list,
    isModalShow: state => state.isModalShow,
    modalConfig: state => state.modalConfig,
    modalData: state => state.modalData
  },
  mutations: {
    SET_LIST(state, data: []) {
      state.list = data.map((item: { [key: string]: any }) => {
        item.doneString = item.done ? '已完成' : '未完成';
        return item;
      });
    },
    TOGGLE_MODAL(state, { flag, config = {}, data = {} }) {
      state.isModalShow = flag ? true : false;
      state.modalConfig = new Modal({ width: '50%', isCancelShow: false, ...config });
      state.modalData = new ModalData(data);
    },
    SET_MODAL(state, data) {
      state.modalData = new ModalData(data);
    }
  },
  actions: {
    setList({ commit }, data) {
      commit('SET_LIST', data);
    },
    async getList({ commit, dispatch }) {
      commit('UPDATE_LOADING', { flag: true }, { root: true });
      dispatch('setCallAPI', new CallAPI('todo/getList'), { root: true });
      const res = await tryCatch(apiGetTodoList)();
      if (res) {
        dispatch('setList', res);
      }
      commit('UPDATE_LOADING', { flag: false }, { root: true });
    },
    async addItem({ getters, commit, dispatch }, data) {
      dispatch('setCallAPI', new CallAPI('todo/addItem', data), { root: true });
      const res = await tryCatch(apiPostTodoItem)(data);
      if (res) {
        dispatch('setList', [...getters.list, res]);
      }
      commit('TOGGLE_MODAL', { flag: false });
    },
    async putItem({ getters, commit, dispatch }, data) {
      dispatch('setCallAPI', new CallAPI(`todo/putItem`, data), { root: true });
      await tryCatch(apiPutTodoItem)(data.id, data);
      const newData = getters.list.map((item: { [key: string]: any }) => (item = item.id === data.id ? data : item));
      dispatch('setList', newData);
      commit('TOGGLE_MODAL', { flag: false });
    },
    async deleteItem({ getters, commit, dispatch }, id: number | string) {
      dispatch('setCallAPI', new CallAPI(`todo/deleteItem`, id), { root: true });
      await tryCatch(apiDeleteTodoItem)(id);
      const newData = getters.list.filter((item: { [key: string]: any }) => item.id !== id);
      dispatch('setList', newData);
      commit('UPDATE_DIALOG_OPEN', { flag: false }, { root: true });
    },
    toggleModal({ commit }, { flag, config, data }) {
      commit('TOGGLE_MODAL', { flag, config, data });
    },
    setModalDate({ commit }, data) {
      commit('SET_MODAL', data);
    }
  }
};

export default todo;
