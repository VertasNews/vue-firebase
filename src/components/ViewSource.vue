<template>
    <div id="view-source">
      <ul class="collection with-header">
        <li class="collection-header">
            <h4>
                <a :href="getSourceURL(this.$route.params.url)" target="_blank">{{ sourceName }}</a>
            </h4>
        </li>
        <li v-for="article in articles" :key="article.id" class="collection-item">
            <router-link
            class="chip"
            :to="{name: 'view-author', params: {author: article.author}}"
            >
                <i class="fa fa-user"></i>
                {{ article.author }}
            </router-link>
            <router-link
              :to="{name: 'view-article', params: {articleId: article.id}}"
            >
                {{ article.title }}
            </router-link>
        </li>
      </ul>
      <!-- <router-link to="/" class="btn grey">Back</router-link> -->
      <!-- <a @click="$router.go(-1)" class="btn grey">Back</a> -->
    </div>
</template>

<script>
import db from './firebaseInit';
import getSourceURL from '../mixins/getSourceURL';

export default {
  name: 'ViewSource',
  data() {
    return {
      articles: [],
      sourceName: null,
    };
  },
  created() {
    this.sourceName = this.$route.params.sourceName;
  },
  beforeRouteEnter(to, from, next) {
    db.collection('articles')
      .where('source.name', '==', to.params.sourceName)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            const data = {
              id: doc.id,
              author: doc.data().author,
              title: doc.data().title,
              url: doc.data().url
            };
            vm.articles.push(data);
          });
        });
      });
  },
  watch: {
    $route: 'fetchData'
  },
  methods: {
    fetchData() {
      db.collection('articles')
        .where('source.name', '==', this.$route.params.sourceName)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
              id: doc.id,
              author: doc.data().author,
              title: doc.data().title,
              url: doc.data().url
            };
            this.articles.push(data);
          });
        });
    }
  },
  mixins: [getSourceURL]
};
</script>
