<template>
  <div id="home">
    <div id="lowestRate">
      <LowestRated />
    </div>
    <div
      v-if="isMobile()"
      :style="{
        marginLeft: marginL + 3 + 'px',
        width: containerWidth - 270 + 'px'
      }"
    >
      <AccuracyRanking />
    </div>
    <div id="header-wrapper">
      <div
        id="header"
        :style="{
          marginLeft: marginL + 3 + 'px',
          width: containerWidth - 270 + 'px'
        }"
      >
        <div id="add-article">
          <router-link to="/new_article" id="add-article-router">
            <img id="plusSign" src="../assets/plus_demo.png" />
            Add Article
          </router-link>
        </div>
        <div v-if="!isOldMobile()" id="header-icon">
          <span class="green-circle"></span>
          <span class="trl green--text right-margin "> TRUTH </span>
          <span class="red-circle"></span>
          <span class="trl red--text text--darken-3 right-margin"> RIGHT </span>
          <span class="blue-circle"></span>
          <span class="trl blue--text text--darken-2"> LEFT </span>
        </div>
      </div>
    </div>
    <div v-if="!isMobile()" id="accuracyRank">
      <AccuracyRanking />
    </div>
    <ul>
      <li
        :style="{
          marginLeft: marginL + 'px',
          width: containerWidth - 270 + 'px'
        }"
        v-for="article in articles"
        :key="article.id"
        class="row"
      >
        <div class="col s12 m3">
          <router-link
            :to="{ name: 'view-article', params: { articleId: article.id } }"
          >
            <v-img
              v-if="article.urlToImage"
              height="150px"
              :src="article.urlToImage"
            >
              <template v-slot:placeholder>
                <v-layout fill-height align-center justify-center ma-0>
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-layout> </template
            ></v-img>
          </router-link>
        </div>
        <div class="col s12 m9">
          <router-link
            :to="{ name: 'view-article', params: { articleId: article.id } }"
          >
            <div class="title-name bigFade">{{ article.title }}</div>
          </router-link>

          <div>
            <router-link
              v-if="article.sourceName"
              :to="{
                name: 'view-source',
                params: { sourceName: article.sourceName }
              }"
            >
              <span class="source-name"> {{ article.sourceName }} </span>
            </router-link>

            <router-link
              v-if="article.author"
              :to="{ name: 'view-author', params: { author: article.author } }"
            >
              <span class="author-name">&ensp; by {{ article.author }} </span>
            </router-link>
          </div>
          <div class="description fade">{{ article.description }}</div>
          <div class="rate-row">
            <span class="green-circle"></span>
            <span class="green-rating" v-if="!article.averageRating"> NA </span>
            <span class="green-rating" v-if="article.averageRating">
              {{ article.averageRating }}<span class="percent">%</span>
            </span>
            <span v-if="!article.averageBiasRating">
              <span class="red-circle"></span>
              <span class="red-rating"> NA </span>
            </span>
            <span v-if="article.right">
              <span class="red-circle"></span>
              <span class="red-rating">
                {{ article.averageBiasRating }}<span class="percent">%</span>
              </span>
            </span>
            <span v-if="article.left">
              <span class="blue-circle"></span>
              <span class="blue-rating">
                {{ article.averageBiasRating }}<span class="percent">%</span>
              </span>
            </span>
            <span v-if="article.neutral">
              <span class="red-circle"> </span>
              <span class="red-rating"> 0<span class="percent">%</span> </span>
            </span>
            <span style="float: right;">
              <router-link
                :to="{
                  name: 'view-article',
                  params: { articleId: article.id }
                }"
              >
                <span class="rate">
                  <img src="../assets/rating.png" class="readnRate" />
                  RATE
                </span>
              </router-link>
              <span class="read">
                <a :href="article.url" target="_blank">
                  <img
                    src="../assets/read-book-icon-12.jpg"
                    class="readnRate"
                  />
                  READ
                </a>
              </span>
            </span>
          </div>
        </div>
      </li>
    </ul>

    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10"
    ></div>
  </div>
</template>

<script>
import db from '../fb';
import LowestRated from '../components/LowestRated';
import AccuracyRanking from '../components/AccuracyRanking';

export default {
  name: 'Home',
  components: {
    AccuracyRanking,
    LowestRated
  },
  data() {
    return {
      articles: [],
      lastVisible: null,
      next: null,
      busy: false,
      windowWidth: null,
      marginL: null,
      containerWidth: null,
      isWindow: false
    };
  },
  created() {
    var first = db
      .collection('articles')
      .orderBy('publishedAt', 'desc')
      .limit(10);

    first.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (doc.data().averageRating) {
          var avgRatingRounded = Math.trunc(doc.data().averageRating * 10);
        }
        var averageBiasRating = doc.data().averageBiasRating;
        if (averageBiasRating < 4) {
          averageBiasRating = Math.trunc((4 - averageBiasRating) / 0.03);
          var left = true;
        } else if (averageBiasRating > 4) {
          averageBiasRating = Math.trunc((averageBiasRating - 4) / 0.03);
          var right = true;
        } else if (averageBiasRating == 4) {
          averageBiasRating = 4;
          var neutral = true;
        }
        const data = {
          id: doc.id,
          author: doc.data().author,
          sourceName: doc.data().source.name,
          title: doc.data().title,
          url: doc.data().url,
          urlToImage: doc.data().urlToImage,
          description: doc.data().description,
          content: doc.data().content,
          publishedAt: doc.data().publishedAt,
          averageRating: avgRatingRounded,
          ratingCount: doc.data().ratingCount,
          averageBiasRating: averageBiasRating,
          biasRatingCount: doc.data().biasRatingCount,
          left: left,
          neutral: neutral,
          right: right
        };
        this.articles.push(data);
      });
      this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      // Construct a new query starting at this document,
      this.next = db
        .collection('articles')
        .orderBy('publishedAt', 'desc')
        .startAfter(this.lastVisible)
        .limit(10);
    });
    if (this.isDesktop()) this.containerWidth = 1050;
    else if (this.isLap()) this.containerWidth = 900;
    else if (this.isLandScape()) this.containerWidth = 850;
    else if (this.isTablet()) this.containerWidth = 700;
    this.marginL = (this.windowWidth - this.containerWidth) / 2 + 20;
    var platform = window.navigator.platform,
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    if (windowsPlatforms.indexOf(platform) != -1) this.isWindow = true;
    if (this.isWindow) this.marginL -= 13;
    if (this.isMobile()) {
      this.containerWidth = this.windowWidth + 250;
      this.marginL = 10;
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      if (this.isDesktop()) this.containerWidth = 1050;
      else if (this.isLap()) this.containerWidth = 900;
      else if (this.isLandScape()) this.containerWidth = 850;
      else if (this.isTablet()) this.containerWidth = 700;
      this.marginL = (this.windowWidth - this.containerWidth) / 2 + 20;
      if (this.isWindow) this.marginL -= 13;
      if (this.isMobile()) {
        this.containerWidth = this.windowWidth + 250;
        this.marginL = 10;
      }
    });
    document
      .getElementById('lowestRate')
      .addEventListener('touchmove', e => e.preventDefault());
  },
  methods: {
    loadMore: function() {
      this.busy = true;

      setTimeout(() => {
        this.next.get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.data().averageRating) {
              var avgRatingRounded = Math.trunc(doc.data().averageRating * 10);
            }
            var averageBiasRating = doc.data().averageBiasRating;
            if (averageBiasRating < 4) {
              averageBiasRating = Math.trunc((4 - averageBiasRating) / 0.03);
              var left = true;
            } else if (averageBiasRating > 4) {
              averageBiasRating = Math.trunc((averageBiasRating - 4) / 0.03);
              var right = true;
            } else if (averageBiasRating == 4) {
              averageBiasRating = 4;
              var neutral = true;
            }

            const data = {
              id: doc.id,
              author: doc.data().author,
              sourceName: doc.data().source.name,
              title: doc.data().title,
              url: doc.data().url,
              urlToImage: doc.data().urlToImage,
              description: doc.data().description,
              content: doc.data().content,
              publishedAt: doc.data().publishedAt,
              averageRating: avgRatingRounded,
              ratingCount: doc.data().ratingCount,
              averageBiasRating: averageBiasRating,
              biasRatingCount: doc.data().biasRatingCount,
              left: left,
              neutral: neutral,
              right: right
            };
            this.articles.push(data);
          });

          this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
          if (!this.lastVisible) {
            this.busy = true;
            return;
          }
          // Construct a new query starting at this document,
          this.next = db
            .collection('articles')
            .orderBy('publishedAt', 'desc')
            .startAfter(this.lastVisible)
            .limit(10);
        });
        this.busy = false;
      }, 1000);
    },
    isLap() {
      return this.windowWidth <= 1100 && this.windowWidth > 900;
    },
    isLandScape() {
      return this.windowWidth <= 900 && this.windowWidth > 800;
    },
    isDesktop() {
      this.windowWidth = window.innerWidth;
      return this.windowWidth > 1100;
    },
    isTablet() {
      return this.windowWidth <= 800 && this.windowWidth > 760;
    },
    isMobile() {
      return this.windowWidth <= 760;
    },
    isOldMobile() {
      return this.windowWidth <= 360;
    }
  }
};
</script>
<style>
.v-btn__content {
  height: 100%;
}
</style>
<style scoped>
li {
  position: relative;
}
.article-title {
  color: black;
  font-weight: bold;
  margin-bottom: 0px;
  font-size: 16px;
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.article-source {
  font-weight: bold;
  color: #0cd7e8;
  font-size: 11px;
  margin-right: 10px;
}
li {
  min-height: 150px;
  font-family: Helvetica, Arial, sans-serif;
}
.article-author {
  font-size: 11px;
  font-weight: bold;
  color: black;
  opacity: 0.61;
}
.article-description {
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 12px;
}
.article-time {
  font-size: 11px;
  color: black;
  opacity: 0.61;
}
.green-circle {
  height: 22px;
  width: 22px;
  background-color: #4caf50;
  border-radius: 50%;
  display: inline-block;
}
.red-circle {
  height: 22px;
  width: 22px;
  background-color: #c62828;
  border-radius: 50%;
  display: inline-block;
}
.blue-circle {
  height: 22px;
  width: 22px;
  /*background-color: #075b80; */
  background-color: #1e88e5;
  border-radius: 50%;
  display: inline-block;
}
.blue-rating {
  color: #1e88e5;
  position: relative;
  bottom: 5px;
  font-size: 18px;
  font-weight: bold;
}
.green-rating {
  color: #4caf50;
  position: relative;
  bottom: 5px;
  font-size: 18px;
  font-weight: bold;
}
.red-rating {
  color: #c62828;
  position: relative;
  bottom: 5px;
  font-size: 18px;
  font-weight: bold;
}
.read,
.rate {
  float: right;
  color: black;
  font-weight: bold;
  opacity: 0.51;
}
.read:hover,
.rate:hover {
  opacity: 1;
}
.rate {
  margin-left: 10px;
}
a {
  color: black;
}
#add-article {
  overflow: hidden;
  position: absolute;
  bottom: 0px;
  width: 80px;
  height: 36px;
  background: white;
  border-radius: 10px;
  border: 1px solid #b7b1b1;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 16px;
  padding: 0 0 0 7px;
  margin-bottom: 10px;
}
#add-article:hover {
  transition: 0.5s;
  width: 135px;
}
#add-article-router {
  display: inline-block;
  width: 100%;
  height: 100%;
}
#header-wrapper {
  position: -webkit-sticky;
  position: -moz-sticky;
  position: -ms-sticky;
  position: -o-sticky;
  position: sticky;
  top: 0px;
  z-index: 1;
  margin-bottom: 0px;
  margin-top: 5px;
}
#header {
  height: 60px;
  padding: 10px 0px 10px 0px;
  background: white;
  position: relative;
}
#header-icon {
  position: absolute;
  right: 0px;
  bottom: 5px;
}
.trl {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: bold;
  position: relative;
  bottom: 5px;
}
.right-margin {
  margin-right: 20px;
}
.sticky {
  top: 50px;
  position: fixed;
}
.title-name {
  font-weight: bold;
  font-size: 18px;
  overflow: hidden;
  position: relative;
  margin-bottom: 5px;
}
.source-name {
  font-weight: bold;
  color: #0cd7e8;
  font-size: 12px;
}
.author-name {
  font-size: 12px;
  font-weight: bold;
  opacity: 0.61;
}
.source-time {
  font-size: 12px;
  opacity: 0.61;
}
.fade {
  position: relative;
  height: 40px; /* exactly three lines */
}
.fade:after {
  content: '';
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10%;
  height: 20px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), #ffffff 50%);
}
.bigFade {
  position: relative;
  max-height: 50px;
}
.bigFade:after {
  content: '';
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10%;
  height: 25px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), #ffffff 50%);
}
.description {
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
}
.col {
  padding: 5px;
}
.rate-row {
  width: 75%;
  padding-right: 20px;
  position: absolute;
  bottom: 0px;
}
#accuracyRank {
  position: -webkit-sticky;
  position: -moz-sticky;
  position: -ms-sticky;
  position: -o-sticky;
  position: sticky;
  top: 60px;
}
#plusSign {
  height: 25px;
  position: relative;
  top: 5px;
}
.readnRate {
  height: 18px;
  opacity: 0.81;
  position: relative;
  top: 4px;
}
.percent {
  font-size: 14px;
  position: relative;
  bottom: 1px;
  left: 1px;
  margin-right: 6px;
}
@media screen and (max-width: 600px) {
  .rate-row {
    position: static;
    width: auto;
  }
}
</style>
