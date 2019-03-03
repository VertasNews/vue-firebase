<template>
  <div id="view-source">
    <ul class="collection with-header">
      <li class="collection-header">
        <h4>
          <a :href="sourceUrl" target="_blank">{{ sourceName }}</a>
          <span class="badge new" data-badge-caption="/ 10">
            count: {{ ratingCount }}, average: {{ averageRating }}
          </span>
        </h4>
      </li>
      <li v-for="article in articles" :key="article.id" class="collection-item">
        <router-link
          v-if="sourceName"
          class="chip"
          :to="{ name: 'view-author', params: { author: article.author } }"
        >
          <i class="fa fa-user"></i>
          {{ article.author }}
        </router-link>
        <router-link
          :to="{ name: 'view-article', params: { articleId: article.id } }"
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
import db from '../fb';

export default {
  name: 'ViewSource',
  data() {
    return {
      articles: [],
      sourceName: null,
      sourceUrl: null,
      averageRating: null,
      ratingCount: null
    };
  },
  created() {
    this.sourceName = this.$route.params.sourceName;
    db.collection('sources')
      .doc(this.sourceName)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.averageRating = doc.data().averageRating;
          this.ratingCount = doc.data().ratingCount;
          this.sourceUrl = doc.data().sourceUrl;
        } else {
          // doc.data() will be undefined in this case
          console.log('No such what!');
        }
      });
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
  }
};
</script>
