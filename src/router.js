import {createWebHistory, createRouter} from 'vue-router';

import App from './App.vue'
import Intro from './page/Intro.vue'
import GameOfLife from "./page/GameOfLife.vue";
const history = createWebHistory();
export const router = createRouter({
  history: history,
  routes: [
    {
      path: '/',
      component: Intro,
    },
    {
      path: '/gameoflife',
      component: GameOfLife,
    },
  ],
});
router.afterEach((a,b,c) => {
  console.log(a,b,c)
  console.log('路由切换了');
});
