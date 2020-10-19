import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Home from '../pages/index.vue';
import Events from '../pages/events.vue';
import { routeNames } from './route-names';

export const routes: RouteRecordRaw[] = [
  {
    path: routeNames.main,
    name: routeNames.main,
    component: Home,
    meta: {
      title: 'Main',
    },
  },
  {
    path: '/' + routeNames.events,
    name: routeNames.events,
    component: Events,
    meta: {
      title: 'Events',
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'is-active',
  linkExactActiveClass: 'is-active',
});
