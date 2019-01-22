<template>
    <div id="view-publisher">
      <ul class="collection with-header">
        <li class="collection-header">
            <h4>
                <a :href="publisher_url" target="_blank">{{ publisher_name }}</a>
            </h4>
        </li>
        <li v-for="article in articles" v-bind:key="article.id" class="collection-item">
            <router-link
            class="chip"
            v-bind:to="{name: 'view-author', params: {author_name: article.author_name}}"
            >
                <i class="fa fa-user"></i>
                {{ article.author_name }}
            </router-link>

            <a :href="article.url" target="_blank">{{ article.title }}</a>
        </li>
        </ul>
      <router-link to="/" class="btn grey">Back</router-link>
      
    </div>
</template>

<script>
import db from './firebaseInit';
export default {
  name: 'view-publisher',
  data() {
    return {
      articles: [],
      publisher_name: null,
      publisher_url: null
    };
  },
  created() {
    this.publisher_name = this.$route.params.publisher_name;
    this.publisher_url = this.$route.params.publisher_url;
  },
  beforeRouteEnter(to, from, next) {
    db.collection('articles')
      .where('publisher_name', '==', to.params.publisher_name)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            const data = {
              id: doc.id,
              author_name: doc.data().author_name,
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
        .where('publisher_name', '==', this.$route.params.publisher_name)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
              id: doc.id,
              author_name: doc.data().author_name,
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
