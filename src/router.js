import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/Dashboard';
import Login from '@/components/Login';
import Register from '@/components/Register';
import firebase from 'firebase';

import ViewAuthor from '@/components/ViewAuthor';
import ViewSource from '@/components/ViewSource';
import NewArticle from '@/components/NewArticle';
import ViewArticle from '@/components/ViewArticle';

Vue.use(Router);

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
      // meta: {
      //   requiresAuth: true
      // }
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
      path: '/:author',
      name: 'view-author',
      component: ViewAuthor
      // meta: {
      //   requiresAuth: true
      // }
    },
    {
      path: '/:sourceName',
      name: 'view-source',
      component: ViewSource
      // meta: {
      //   requiresAuth: true
      // }
    },
    {
      path: '/:articleId',
      name: 'view-article',
      component: ViewArticle,
      meta: {
        requiresAuth: true
      }
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
