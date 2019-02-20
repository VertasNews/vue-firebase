<template>
    <div id="view-author">
      <ul class="collection with-header">
      <li class="collection-header">
        <h4>{{ author }}</h4>
      </li>
      <li v-for="article in articles" :key="article.id" class="collection-item">
        <router-link
          class="chip"
          :to="{name: 'view-source', 
            params: {sourceName: article.sourceName, 
            url: article.url}}"
        >
            {{ article.sourceName }}
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

export default {
  name: 'ViewAuthor',
  data() {
    return {
      articles: [],
      author: null
    };
  },
  created() {
    this.author = this.$route.params.author;
  },
  beforeRouteEnter(to, from, next) {
    db.collection('articles')
      .where('author', '==', to.params.author)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            const data = {
              id: doc.id,
              sourceName: doc.data().source.name,
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
        .where('author', '==', this.$route.params.author)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
              id: doc.id,
              sourceName: doc.data().source.name,
              title: doc.data().title,
              url: doc.data().url
            };
            this.articles.push(data);
          });
        });
    }
  }
};
</script>
