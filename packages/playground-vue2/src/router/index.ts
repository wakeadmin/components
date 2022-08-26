import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import FormView from '../views/FormView.vue';
import LayoutView from '../views/LayoutView.vue';
import FormLayoutView from '../views/FormLayoutView.vue';

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
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
