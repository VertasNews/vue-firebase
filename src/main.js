import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import firebase from 'firebase';
import './components/firebaseInit';
import StarRating from 'vue-star-rating';

Vue.config.productionTip = false;
Vue.component('star-rating', StarRating);

let app;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user);
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
