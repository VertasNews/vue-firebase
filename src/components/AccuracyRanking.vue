<template>
  <div id="accuracy-ranking">

    <div id="chart-title"> Outlets Accuracy Rank </div>
     <ul>
      <li v-for="source in sources" :key="source.name" class="collection-item">
        <router-link
          :to="{
            name: 'view-source',
            params: { sourceName: source.name }
          }"
        >
         <v-avatar size="32px" v-if="getImgUrl(source.id)">
          <img class="img-circle mb-1" :src="getImgUrl(source.id)" />
        </v-avatar>
        <span class="source-name" v-if="!getImgUrl(source.id)"> {{source.name}} </span> </router-link
        >
        <span v-bind:style="{width: source.length + 'px'}" class="ranking-bar"> </span>
        <span class="rating-num"
          v-if="source.averageRating"
          > {{ source.averageRating }}%</span
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
        var index = 0;
        querySnapshot.forEach(doc => {

          if (doc.data().averageRating) {
            var avgRatingRounded = Math.trunc(doc.data().averageRating * 10);
            var rankLength = avgRatingRounded * 1.4;
          }
          const data = {
            name: doc.id,
            id: doc.data().id,
            sourceUrl: doc.data().sourceUrl,
            averageRating: avgRatingRounded,
            ratingCount: doc.data().ratingCount,
            length: rankLength
          };
           this.sources.push(data);
        });
      });
  },
  beforeMount () {
    
  },
  methods: {
    getImgUrl(pic) {
      if (pic) return require('../assets/images/' + pic + '.png');
      else return null;
    },
    changeLength: function () {
      
    }

  }
};
</script>
<style scoped>
#chart-title {
  font-family: Helvetica,Arial,sans-serif;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
.ranking-bar {
  
  border-radius: 50px;
  height: 12px;
  background-color: #4CAF50;
  display: inline-block;
  margin-top: 10px;
}
#accuracy-ranking {
  position: absolute;
  left: 65%;
  border-radius: 10px;
  width: 250px;
  height: 300px;
  border: 1px solid #B7B1B1;
  padding: 10px 10px 10px 10px;
}
.v-avatar {
  margin-right: 10px;
  margin-bottom: 5px;
}
.rating-num {
  font-family: Helvetica,Arial,sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #438007;
}
.source-name {
  font-size: 12px;
  display: inline-block;
  width: 42px;
  overflow: hidden;
}
</style>

