<template>
  <div
    id="view-article"
    :style="{ marginLeft: marginL + 'px', width: containerWidth + 'px' }"
  >
    <div class="card">
      <div class="card-content row">
        <div class="col s12 m3">
          <v-img v-if="urlToImage" :height="imgHeight()" :src="urlToImage">
            <template v-slot:placeholder>
              <v-layout fill-height align-center justify-center ma-0>
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-layout>
            </template>
          </v-img>
        </div>
        <div class="col s12 m9">
          <div class="title-name">
            <a :href="url" target="_blank">{{ title }}</a>
          </div>
          <div>
            <router-link
              v-if="sourceName"
              :to="{
                name: 'view-source',
                params: { sourceName: sourceName }
              }"
            >
              <span class="source-name"> {{ sourceName }} </span>
            </router-link>
          </div>
          <div class="authorntime">
            <router-link
              v-if="author"
              :to="{ name: 'view-author', params: { author: author } }"
            >
              <span class="author-name"> {{ author }} </span>
            </router-link>
            <span class="source-time">{{
              publishedAt | moment('MMMM Do YYYY, h:mm a')
            }}</span>
          </div>
          <div v-if="!isSmallMobile()" class="article-content fade">
            <a :href="url" target="_blank">{{ content }} </a>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-content">
        <div class="row">
          <div class="col s6 m3 text-xs-center borderRight1">
            <div class="col s12 score-title">Critics Rate</div>
            <div class="col s6 accuracy-rate">NA</div>
            <div class="col s6 bias-rate red--text text--darken-3">NA</div>
            <div class="col s6 rating-num">0 rating(s)</div>
            <div class="col s6 rating-num">0 rating(s)</div>
          </div>
          <div class="col s6 m3 text-xs-center borderRight2">
            <div class="col s12 score-title">Users Rate</div>
            <div v-if="averageRating" class="col s6 accuracy-rate">
              {{ averageRating }}
            </div>
            <div v-else class="col s6 accuracy-rate">NA</div>
            <div v-if="left" class="col s6 bias-rate blue--text">
              {{ averageBiasRating }}
            </div>
            <div v-if="right" class="col s6 bias-rate red--text text--darken-2">
              {{ averageBiasRating }}
            </div>
            <div
              v-if="neutral"
              class="col s6 bias-rate red--text text--darken-2"
            >
              0%
            </div>
            <div
              v-if="!averageBiasRating"
              class="col s6 bias-rate red--text text--darken-2"
            >
              NA
            </div>
            <div class="col s6 rating-num">{{ ratingCount }} rating(s)</div>
            <div v-if="biasRatingCount" class="col s6 rating-num">
              {{ biasRatingCount }} rating(s)
            </div>
            <div v-else class="col s6 rating-num">0 rating(s)</div>
          </div>
          <div class="col s12 m6 text-xs-center">
            <div class="rating-instruction">
              Please provide us with an objective rating of the article's
              accuracy and biases
            </div>
            <div id="rate-button"><RatingPopup v-if="popup" /></div>
          </div>
        </div>
      </div>
    </div>

    <router-link to="/">
      <v-btn id="return-home" outline flat color="green" depressed>
        Home
      </v-btn>
    </router-link>
  </div>
</template>

<script>
import db from '../fb';
import RatingPopup from '../components/RatingPopup';

export default {
  name: 'ViewArticle',
  components: { RatingPopup },
  data() {
    return {
      popup: true,
      articleId: null,
      title: null,
      url: null,
      author: null,
      sourceName: null,
      description: null,
      content: null,
      urlToImage: null,
      publishedAt: null,
      averageRating: null,
      ratingCount: null,
      averageBiasRating: null,
      biasRatingCount: null,
      left: false,
      neutral: false,
      right: false,
      windowWidth: null,
      marginL: null,
      containerWidth: null
    };
  },
  created() {
    if (this.isDesktop()) this.containerWidth = 1010;
    else if (this.isLap()) this.containerWidth = 860;
    else if (this.isLandScape()) this.containerWidth = 710;
    else if (this.isTablet()) this.containerWidth = 660;
    else this.containerWidth = this.windowWidth;
    this.marginL = (window.innerWidth - this.containerWidth) / 2;

    db.collection('articles')
      .doc(this.$route.params.articleId)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.author = doc.data().author;
          this.sourceName = doc.data().source.name;
          this.title = doc.data().title;
          this.url = doc.data().url;
          this.description = doc.data().description;
          this.content = doc.data().content;
          this.urlToImage = doc.data().urlToImage;
          this.publishedAt = doc.data().publishedAt;
          if (doc.data().averageRating) {
            this.averageRating = Math.trunc(doc.data().averageRating * 10);
            this.ratingCount = doc.data().ratingCount;
          } else this.ratingCount = 0;
          if (doc.data().averageBiasRating < 4) {
            this.averageBiasRating = Math.trunc(
              (4 - doc.data().averageBiasRating) / 0.03
            );
            this.left = true;
          } else if (doc.data().averageBiasRating > 4) {
            this.averageBiasRating = Math.trunc(
              (doc.data().averageBiasRating - 4) / 0.03
            );
            this.right = true;
          } else if (doc.data().averageBiasRating == 4) {
            this.averageBiasRating = 4;
            this.neutral = true;
          }
          this.biasRatingCount = doc.data().biasRatingCount;
        } else if (!doc.data().averageBiasRating) {
          this.biasRatingCount = 0;
        }
      });
  },
  mounted() {
    window.addEventListener('resize', () => {
      if (this.isDesktop()) this.containerWidth = 1010;
      else if (this.isLap()) this.containerWidth = 860;
      else if (this.isLandScape()) this.containerWidth = 710;
      else if (this.isTablet()) this.containerWidth = 660;
      else this.containerWidth = this.windowWidth;
      this.marginL = (this.windowWidth - this.containerWidth) / 2;
    });
  },
  methods: {
    isLap() {
      return this.windowWidth <= 1100 && this.windowWidth > 900;
    },
    isDesktop() {
      this.windowWidth = window.innerWidth;
      return this.windowWidth > 1100;
    },
    isLandScape() {
      return this.windowWidth <= 900 && this.windowWidth > 800;
    },
    isTablet() {
      return this.windowWidth <= 800 && this.windowWidth > 760;
    },
    isMobile() {
      return this.windowWidth <= 760;
    },
    isSmallMobile() {
      return this.windowWidth <= 600;
    },
    imgHeight() {
      if (this.isSmallMobile()) return '180px';
      else return '250px';
    }
  }
};
</script>
<style scoped>
a {
  color: black;
}
div {
  font-family: Helvetica, Arial, sans-serif;
}
.container {
  width: 1032px;
}
.title-name {
  font-weight: bold;
  font-size: 20px;
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
.authorntime {
  margin-bottom: 10px;
}
.score-title {
  font-size: 20px;
  font-weight: bold;
}
.accuracy-rate {
  font-size: 57px;
  font-weight: bold;
  color: #4caf50;
}
.bias-rate {
  font-size: 57px;
  font-weight: bold;
}
.borderRight1 {
  border-right: 1px solid black;
}
.borderRight2 {
  border-right: 1px solid black;
}
.rating-instruction {
  height: 60px;
  font-size: 16px;
}
.rating-header {
  height: 50px;
}
.card .card-content {
  padding: 20px 0px 20px 20px;
}
#return-home {
  margin-left: 0;
}
.article-content {
  position: relative;
  overflow: hidden;
}
.fade {
  position: relative;
  max-height: 80px;
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
#rate-button {
  position: relative;
  top: 7px;
}
@media screen and (max-width: 900px) {
  .accuracy-rate {
    font-size: 46px;
    padding: 0px;
  }
  .bias-rate {
    font-size: 46px;
    padding: 0px;
  }
  .rating-num {
    font-size: 11px;
    padding: 0px;
  }
}
@media screen and (max-width: 760px) {
  #return-home {
    margin-left: 5px;
  }
  .card .card-content {
    padding: 20px 0px 10px 0px;
  }
  .accuracy-rate {
    font-size: 40px;
  }
  .bias-rate {
    font-size: 40px;
  }
  .score-title {
    font-size: 19px;
  }
}
@media screen and (max-width: 640px) {
}
@media screen and (max-width: 600px) {
  .borderRight2 {
    border-right: none;
  }
  .borderRight1 {
    border-right: none;
  }
  .rating-instruction {
    border-top: 1px solid black;
    padding-top: 10px;
    margin-top: 10px;
  }
  .accuracy-rate {
    font-size: 50px;
  }
  .bias-rate {
    font-size: 50px;
  }
  #rate-button {
    top: 8px;
  }
}
@media screen and (max-width: 410px) {
  .accuracy-rate {
    font-size: 45px;
  }
  .bias-rate {
    font-size: 45px;
  }
}
@media screen and (max-width: 360px) {
  .rating-num {
    padding: 0px;
  }
}
</style>
