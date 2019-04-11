import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import firebase from 'firebase';
import '@/fb';
import Vuetify from 'vuetify';
import VueAnalytics from 'vue-analytics';

Vue.config.productionTip = false;

Vue.use(Vuetify);

const isProd = process.env.NODE_ENV === 'production';

Vue.use(VueAnalytics, {
  id: 'UA-128196672-3',
  router,
  debug: {
    enabled: !isProd,
    sendHitTask: isProd
  }
});

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
