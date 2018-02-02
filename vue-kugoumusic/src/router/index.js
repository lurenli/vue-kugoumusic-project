import Vue from 'vue';
import Router from 'vue-router';
//import PageTransition from './components/PageTransition';
//import NewSongs from '../views/NewSongs';

const PageTransition = resolve => require(['../components/PageTransition'], resolve);
const newSongs = resolve => require(['../views/NewSongs'], resolve);
const rank = resolve => require(['../views/Rank'], resolve);
const plist = resolve => require(['../views/Plist'], resolve);
Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}
Vue.use(Router)

export const routes = [
   {
      path: '/',
      name: 'PageTransition',
      component: PageTransition,
      children: [{
        path: '',
        component: newSongs
    },{
       path: '/rank',
       component: rank
    },{
       path: '/plist',
       component: plist
    },{
       path: '/singer',
       component: require('../views/Singer')
    }, {
       path: '/search',
       component: require('../views/Search')
    }, {
       path: '/rank/info/:id',
       component: require('../views/RankInfo')
    }, {
       path: '/plist/info/:id',
       component: require('../views/PlistInfo')
    }, {
       path: '/singer/list/:id',
       component: require('../views/SingerList')
    }, {
       path: '/singer/info/:id',
       component: require('../views/SingerInfo')
    }, {
       path: '*', redirect: '/'
    }]
  }
]
