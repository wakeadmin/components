import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FormView from '../views/FormView/index.vue';
import LayoutView from '../views/LayoutView.vue';
import FormLayoutView from '../views/FormLayoutView.vue';
import ComponentTest from '../views/ComponentTest.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  // 基础路由
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/form',
    name: 'form',
    component: FormView,
  },
  {
    path: '/layout',
    name: 'layout',
    component: LayoutView,
  },
  {
    path: '/form-layout',
    name: 'formLayout',
    component: FormLayoutView,
  },
  {
    path: '/component-test',
    name: 'componentTest',
    component: ComponentTest,
  },
  {
    path: '/tree-select',
    name: 'tree-select',
    component: () => import('../views/TreeSelect.vue'),
  },
  {
    path: '/form-tabs',
    name: 'form-tabs',
    component: () => import('../views/FormTabs.vue'),
  },
  {
    path: '/steps',
    name: 'steps',
    component: () => import('../views/Steps.vue'),
  },
  {
    path: '/steps-define',
    name: 'steps-define',
    component: () => import('../views/StepsDefine'),
  },
  {
    path: '/steps-vertical',
    name: 'steps-vertical',
    component: () => import('../views/Steps-Vertical.vue'),
  },
  {
    path: '/steps-complex',
    name: 'steps-complex',
    component: () => import('../views/Steps-Complex.vue'),
  },
  {
    path: '/steps-complex-vertical',
    name: 'steps-complex-vertical',
    component: () => import('../views/Steps-Complex-Vertical.vue'),
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/table-select',
    name: 'tableSelect',
    component: () => import('../views/tableSelect.vue'),
  },
  {
    path: '/drag',
    name: 'drag',
    component: () => import('../views/drag.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
