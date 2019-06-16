<template>
  <div id="view-source" class ="container">
    
      <div class ="row">
         <div style="font-size: 40px;" class = "col s12">
          <a :href="sourceUrl" target="_blank">
            <v-avatar size="64px" v-if="sourceId">
              <img class="img-circle mb-1" :src="getImgUrl(sourceId)" />
            </v-avatar>
            {{ sourceName }}
          </a>
          
          </div>

         
           <div class ="col s3">
             
            <span class = "big-green-circle"> </span>

            <span class = "big-rating green--text" v-if="averageRating"> {{averageRating }}% </span>

            <span class="big-rating green--text" v-if="!averageRating"> NA </span>
          
          
            <span class = "big-red-circle"> </span>
            <span class ="big-rating red--text"> NA </span>
          </div>
        <!--  <div
            class="col s4"
        >
          <div class ="col s6">
            <span class = "big-green-circle"> </span>

            <span class = "big-rating green--text" v-if="averageRating"> {{averageRating }}% </span>

            <span class="big-rating green--text" v-if="!averageRating"> NA </span>
          </div>
          <div class ="col s6">
            <span class = "big-red-circle"> </span>
            <span class ="big-rating red--text"> NA </span>
          </div>
        </div> -->

      </div>
      
      
      <div style="margin-bottom: 30px" class = "divider"> </div>
      <ul class = "row">
      <li v-for="article in articles" :key="article.id" class="row">
        
        <div class = "col s9 title-name">
          <div class = "col s1">
          <img
            src="../assets/final_logo.jpg"
            style="height: 60px;"
          />
          </div>
          <div class = "col s11">
            <div>
          <router-link
          :to="{ name: 'view-article', params: { articleId: article.id } }"
           >
          {{ article.title }}
          </router-link>
            </div>
            <div>
           <router-link
            v-if="article.author"
            :to="{ name: 'view-author', params: { author: article.author } }"
          > <span class ="author-name">
            - {{ article.author.replace(/,/g, '/') }} </span>
          </router-link>
            </div>
          </div>
        </div>
        
        <div
            class="col s3"
        >
          <div class ="col s6">
            <span class = "green-circle"> </span>

            <span class = "rating green--text" v-if="article.averageRating"> {{ article.averageRating }}% </span>

            <span class="rating green--text" v-if="!article.averageRating"> NA </span>
          </div>
          <div class ="col s6">
            <span class = "red-circle"> </span>
            <span class ="rating red--text"> NA </span>
          </div>
        </div>
          
          
         
          
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
      ratingCount: null,
      urlToImage: null
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
              ratingCount: doc.data().ratingCount,
              urlToImage: doc.data().urlToImage,
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
            if (doc.data().averageRating) {
              var avgRatingRounded = Math.trunc(doc.data().averageRating * 10);
            }
            const data = {
              id: doc.id,
              author: doc.data().author,
              title: doc.data().title,
              url: doc.data().url,
              averageRating: avgRatingRounded,
              ratingCount: doc.data().ratingCount,
              urlToImage: doc.data().urlToImage
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

<style scoped>
a {
  color: black;
}
.title-name {
  font-weight: bold;
  font-size: 20px;
}
.green-circle {
  position: relative;
  top: 5px;
  height: 22px;
  width: 22px;
  background-color: #4CAF50;
  border-radius: 50%;
  display: inline-block;
}
.red-circle {
  position: relative;
  top: 5px;
  height: 22px;
  width: 22px;
  background-color:#B20000;
  border-radius: 50%;
  display: inline-block;
}
.rating {
  position: relative;
  bottom: 0px;
  font-size: 18px;
  font-weight: bold;
}
.author-name {
  font-size: 12px;
  font-weight: bold;
  opacity: 0.61;
}



.big-rating {
  font-size: 36px;
  font-weight: bold;
}
.big-green-circle {
  position: relative;
  top: 5px;
  height: 33px;
  width: 33px;
  background-color: #4CAF50;
  border-radius: 50%;
  display: inline-block;
}
.big-red-circle {
  position: relative;
  top: 5px;
  height: 33px;
  width: 33px;
  background-color:#B20000;
  border-radius: 50%;
  display: inline-block;
}
.container {
  width: 58%;

}
</style>
