<template>
  <div id="lowest-rated">
    <v-card>
      <v-card-title>
        <h5>
          LOWEST RATED ARTICLES
        </h5>
      </v-card-title>
      <vueper-slides
        class="no-shadow"
        :visible-slides="3"
        :slide-ratio="1 / 7"
        :dragging-distance="70"
        :slide-multiple="true"
      >
        <vueper-slide
          v-for="article in articles"
          :key="article.id"
          :title="article.title"
          :content="article.averageRating"
          :style="'background-color: ' + ['#ff5252', '#42b983'][i % 2]"
        >
        </vueper-slide>
      </vueper-slides>
    </v-card>
  </div>
</template>

<script>
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';
import db from '../fb';

export default {
  name: 'LowestRated',
  components: {
    VueperSlides,
    VueperSlide
  },
  data() {
    return {
      articles: []
    };
  },
  created() {
    db.collection('articles')
      .orderBy('averageRating')
      .limit(10)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.data().averageRating) {
            var avgRatingRounded = Math.trunc(doc.data().averageRating * 10);
          }
          const data = {
            id: doc.id,
            author: doc.data().author,
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
};
</script>
