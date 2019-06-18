<template>
  <div id="view-source">
    <ul class="collection with-header">
      <li class="collection-header">
        <h4>
          <a :href="sourceUrl" target="_blank">
            <v-avatar size="32px" v-if="sourceId">
              <img class="img-circle mb-1" :src="getImgUrl(sourceId)" />
            </v-avatar>
            {{ sourceName }}
          </a>
          <span class="badge new" data-badge-caption="%" v-if="averageRating">
            Accuracy rating: {{ averageRating }}
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
            data-badge-caption="%"
            v-if="article.averageRating"
          >
            Accuracy rating: {{ article.averageRating }}
          </span>
          <router-link
            v-if="article.author"
            class="chip"
            :to="{ name: 'view-author', params: { author: article.author } }"
          >
            <i class="fa fa-user"></i>
            {{ article.author.replace(/,/g, '/') }}
          </router-link>
        </p>
      </li>
    </ul>
    <router-link to="/" class="btn grey">Home</router-link>
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
      sourceId: null,
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
          if (doc.data().averageRating)
            this.averageRating = Math.trunc(doc.data().averageRating * 10);
          this.ratingCount = doc.data().ratingCount;
          this.sourceUrl = doc.data().sourceUrl;
          this.sourceId = doc.data().id;
        } else {
          // doc.data() will be undefined in this case
          console.log('No such what!');
        }
      });
  },
  beforeRouteEnter(to, from, next) {
    db.collection('articles')
      .where('source.name', '==', to.params.sourceName)
      .orderBy('publishedAt', 'desc')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            if (doc.data().averageRating) {
              var avgRatingRounded = Math.trunc(doc.data().averageRating * 10);
            }
            const data = {
              id: doc.id,
              author: doc.data().author,
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
        .where('source.name', '==', this.$route.params.sourceName)
        .orderBy('publishedAt', 'desc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.data().averageRating) {
              var avgRatingRounded = Math.trunc(doc.data().averageRating * 10);
            }
            const data = {
              id: doc.id,
              author: doc.data().author,
              title: doc.data().title,
              url: doc.data().url,
              averageRating: avgRatingRounded,
              ratingCount: doc.data().ratingCount
            };
            this.articles.push(data);
          });
        });
    },
    getImgUrl(pic) {
      if (pic) return require('../assets/images/' + pic + '.png');
      else return null;
    }
  }
};
</script>
