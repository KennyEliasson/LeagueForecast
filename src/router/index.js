import Vue from 'vue';
import Router from 'vue-router';
import Leagues from '@/components/Leagues';
import League from '@/components/League';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Leagues',
      component: Leagues,
      alias: '/leagues'
    },
    {
      path: '/leagues/:name/:season/',
      name: 'League',
      component: League
    }
  ]
});
