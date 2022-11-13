import { RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FormView from '../views/FormView/index.vue';
import FormLayoutView from '../views/FormLayoutView.vue';
import ComponentTest from '../views/ComponentTest.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  // 微前端测试
  {
    path: '/materials/picture/list',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/form',
    name: 'form',
    component: FormView,
  },
  {
    path: '/form-layout',
    name: 'form-layout',
    component: FormLayoutView,
  },
  {
    path: '/component-test',
    name: 'component-test',
    component: ComponentTest,
  },
  {
    path: '/table-select',
    name: 'table-select',
    component: () => import('../views/tableSelect.vue'),
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
];
