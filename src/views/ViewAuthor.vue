<template>
  <div id="view-author">
    <ul class="collection with-header">
      <li class="collection-header">
        <h4>
          {{ author }}
          <span class="badge new" data-badge-caption="/ 10">
            count: {{ ratingCount }}, average: {{ averageRating }}
          </span>
        </h4>
      </li>
      <li v-for="article in articles" :key="article.id" class="collection-item">
        <router-link
          :to="{ name: 'view-article', params: { articleId: article.id } }"
        >
          {{ article.title }}
        </router-link>
        <p>
          <span
            class="badge new"
            data-badge-caption="/ 10"
            v-if="article.averageRating"
          >
            count: {{ article.ratingCount }}, average:
            {{ article.averageRating }}
          </span>
          <router-link
            v-if="author"
            class="chip"
            :to="{
              name: 'view-source',
              params: { sourceName: article.sourceName }
            }"
          >
            {{ article.sourceName }}
          </router-link>
        </p>
      </li>
    </ul>
    <router-link to="/" class="btn grey">Home</router-link>
    <!-- <a @click="$router.go(-1)" class="btn grey">Back</a> -->
  </div>
</template>

<script>
import db from '../fb';

export default {
  name: 'ViewAuthor',
  data() {
    return {
      articles: [],
      author: null,
      averageRating: null,
      ratingCount: null
    };
  },
  created() {
    this.author = this.$route.params.author;
    db.collection('authors')
      .doc(this.author)
      .get()
      .then(doc => {
        if (doc.exists) {
          if (doc.data().averageRating)
            this.averageRating = doc.data().averageRating.toFixed(2);
          this.ratingCount = doc.data().ratingCount;
        } else {
          // doc.data() will be undefined in this case
          console.log('No such what!');
        }
      });
  },
  beforeRouteEnter(to, from, next) {
    db.collection('articles')
      .where('author', '==', to.params.author)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            if (doc.data().averageRating) {
              var avgRatingRounded = doc.data().averageRating.toFixed(2);
            }
            const data = {
              id: doc.id,
              sourceName: doc.data().source.name,
              title: doc.data().title,
              url: doc.data().url,
              averageRating: avgRatingRounded,
              ratingCount: doc.data().ratingCount
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
            if (doc.data().averageRating) {
              var avgRatingRounded = doc.data().averageRating.toFixed(2);
            }
            const data = {
              id: doc.id,
              sourceName: doc.data().source.name,
              title: doc.data().title,
              url: doc.data().url,
              averageRating: avgRatingRounded,
              ratingCount: doc.data().ratingCount
            };
            this.articles.push(data);
          });
        });
    }
  }
};
</script>
