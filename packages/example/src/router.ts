import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Main from './pages/main.vue';
import Login from './pages/login.vue';

export const routeNames = {
  main: 'main',
  login: 'login',
};

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: routeNames.main,
    component: Main,
  },
  {
    path: '/login',
    name: routeNames.login,
    component: Login,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'is-active',
  linkExactActiveClass: 'is-active',
});
