import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import firebase from 'firebase';
import '@/fb';
import Vuetify from 'vuetify';
import VueAnalytics from 'vue-analytics';
import infiniteScroll from 'vue-infinite-scroll';

Vue.use(infiniteScroll);
Vue.use(Vuetify);
Vue.use(require('vue-moment'));

Vue.config.productionTip = false;
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
