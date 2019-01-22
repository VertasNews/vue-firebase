import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/Dashboard';
import NewUser from '@/components/NewUser';
import EditUser from '@/components/EditUser';
import Login from '@/components/Login';
import Register from '@/components/Register';
import firebase from 'firebase';

import ViewAuthor from '@/components/ViewAuthor';
import ViewPublisher from '@/components/ViewPublisher';

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
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
      path: '/new',
      name: 'new-user',
      component: NewUser,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/edit/:user_id',
      name: 'edit-user',
      component: EditUser,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/:author_name',
      name: 'view-author',
      component: ViewAuthor,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/:publisher_name',
      name: 'view-publisher',
      component: ViewPublisher,
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
