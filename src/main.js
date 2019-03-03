import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import firebase from 'firebase';
import '@/fb';
import Vuetify from 'vuetify';

Vue.config.productionTip = false;
Vue.use(Vuetify);

let app;
// eslint-disable-next-line
firebase.auth().onAuthStateChanged(function(user) {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app');
  }
});
