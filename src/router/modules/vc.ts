import InvestorList from '@/views/Investor/list.vue';
import Function1 from '@/views/Fun/fun1.vue';

export default [
  {
    path: '/vc-investor',
    redirect: '/vc-investor/list',
  },
  {
    path: '/vc-investor/list',
    name: 'vc-investor-list',
    component: InvestorList,
  },
  {
    path: '/vc-fun',
    redirect: '/vc-fun/fun1',
  },
  {
    path: '/vc-fun/fun1',
    name: 'vc-fun-fun1',
    component: Function1,
  },
];
