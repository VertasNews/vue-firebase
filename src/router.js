import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/Dashboard';
import NewUser from '@/components/NewUser';
import ViewUser from '@/components/ViewUser';
import EditUser from '@/components/EditUser';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/new',
      name: 'new-user',
      component: NewUser
    },
    {
      path: '/edit/:user_id',
      name: 'edit-user',
      component: EditUser
    },
    {
      path: '/:user_id',
      name: 'view-user',
      component: ViewUser
    }
  ]
});
