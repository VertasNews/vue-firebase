<template>
    <div id="view-author">
      <ul class="collection with-header">
      <li class="collection-header">
        <h4>{{ author_name }}</h4>
      </li>
      <li v-for="article in articles" v-bind:key="article.id" class="collection-item">
        <router-link
          class="chip"
          v-bind:to="{name: 'view-publisher', 
            params: {publisher_name: article.publisher_name, 
            publisher_url: getPublisherURL(article.url)}}"
        >
            {{ article.publisher_name }}
        </router-link>

        <a :href="article.url" target="_blank">{{ article.title }}</a>
      
      </li>
    </ul>
      <router-link to="/" class="btn grey">Back</router-link>
      
    </div>
</template>

<script>
import db from './firebaseInit';
import getPublisherURL from '../mixins/getPublisherURL';

export default {
  name: 'view-author',
  data() {
    return {
      articles: [],
      author_name: null
    };
  },
  created() {
    this.author_name = this.$route.params.author_name;
  },
  beforeRouteEnter(to, from, next) {
    db.collection('articles')
      .where('author_name', '==', to.params.author_name)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            const data = {
              id: doc.id,
              publisher_name: doc.data().publisher_name,
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
        .where('author_name', '==', this.$route.params.author_name)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
              id: doc.id,
              publisher_name: doc.data().publisher_name,
              title: doc.data().title,
              url: doc.data().url
            };
            this.articles.push(data);
          });
        });
    }
  },
  mixins: [getPublisherURL]
};
</script>
