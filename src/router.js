import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase/app';
import 'firebase/auth';

import Home from '@/views/Home';
import Login from '@/views/Login';
import Register from '@/views/Register';
import ViewAuthor from '@/views/ViewAuthor';
import ViewSource from '@/views/ViewSource';
import NewArticle from '@/views/NewArticle';
import ViewArticle from '@/views/ViewArticle';
import MobileSearch from '@/views/MobileSearch';
import About from '@/views/About';

Vue.use(Router);

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/new_article',
      name: 'new-article',
      component: NewArticle,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/author/:author',
      name: 'view-author',
      component: ViewAuthor
    },
    {
      path: '/source/:sourceName',
      name: 'view-source',
      component: ViewSource
    },
    {
      path: '/article/:articleId',
      name: 'view-article',
      component: ViewArticle
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/search',
      name: 'mobile-search',
      component: MobileSearch
    }
  ]
});

// Nav Guard
router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if NO logged user
    if (!firebase.auth().currentUser) {
      // Go to login
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check if NO logged user
    if (firebase.auth().currentUser) {
      // Go to login
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else {
    // Proceed to route
    next();
  }
});

export default router;
