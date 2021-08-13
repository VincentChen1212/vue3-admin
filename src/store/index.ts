import { createStore } from 'vuex';
import global from './modules/global';
import todo from './modules/todo';
import investor from './modules/investor';
import fun1 from './modules/fun1';

export default createStore({
  modules: {
    global,
    todo,
    investor,
    fun1
  }
});
