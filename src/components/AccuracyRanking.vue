<template>
  <div id="accuracy-raking">
    <ul class="collection with-header">
      <li class="collection-header">
        <h5>Accuracy Ranking</h5>
      </li>
      <li v-for="source in sources" :key="source.name" class="collection-item">
        <v-avatar size="32px" v-if="source.id">
          <img class="img-circle mb-1" :src="getImgUrl(source.id)" />
        </v-avatar>
        <router-link
          class="title"
          :to="{
            name: 'view-source',
            params: { sourceName: source.name }
          }"
        >
          {{ source.name }}</router-link
        >
        <span
          class="badge new"
          data-badge-caption="%"
          v-if="source.averageRating"
          >Accuracy rating: {{ source.averageRating }}</span
        >
      </li>
    </ul>
  </div>
</template>

<script>
import db from '../fb';

export default {
  name: 'AccuracyRanking',
  data() {
    return {
      sources: []
    };
  },
  created() {
    db.collection('sources')
      .orderBy('averageRating', 'desc')
      .limit(10)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.data().averageRating) {
            var avgRatingRounded = Math.trunc(doc.data().averageRating * 10);
          }
          const data = {
            name: doc.id,
            id: doc.data().id,
            sourceUrl: doc.data().sourceUrl,
            averageRating: avgRatingRounded,
            ratingCount: doc.data().ratingCount
          };
          this.sources.push(data);
        });
      });
  },
  methods: {
    getImgUrl(pic) {
      if (pic) return require('../assets/images/' + pic + '.png');
      else return null;
    }
  }
};
</script>
