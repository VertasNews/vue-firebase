import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import firebase from 'firebase';
import '@/fb';
import StarRating from 'vue-star-rating';
import Vuetify from 'vuetify';

Vue.config.productionTip = false;
Vue.component('star-rating', StarRating);
Vue.use(Vuetify);

let app;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log('Logged In');
  }
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app');
  }
});
