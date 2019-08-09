<template>
  <div
    id="view-source"
    :style="{ marginLeft: marginL + 'px', width: containerWidth + 'px' }"
  >
    <div>
      <div class="source-title">
        <a :href="sourceUrl" target="_blank">
          <img
            v-if="sourceId"
            class="source-image"
            :src="getImgUrl(sourceId)"
          />
          {{ sourceName }}
        </a>
      </div>
      <div class="source-rating">
        <span class="big-green-circle"> </span>
        <span class="big-rating green--text" v-if="averageRating">
          {{ averageRating }}<span class="big-percent">%</span>
        </span>
        <span class="big-rating green--text" v-else> NA </span>
        <span v-if="!averageBiasRating">
          <span class="big-red-circle"> </span>
          <span class="big-rating red--text text--darken-3"> NA </span>
        </span>
        <span v-if="right">
          <span class="big-red-circle"> </span>
          <span class="big-rating red--text text--darken-3">
            {{ averageBiasRating }}<span class="big-percent">%</span>
          </span>
        </span>
        <span v-if="left">
          <span class="big-blue-circle"> </span>
          <span class="big-rating blue--text text--darken-2">
            {{ averageBiasRating }}<span class="big-percent">%</span>
          </span>
        </span>
        <span v-if="neutral">
          <span class="big-red-circle"> </span>
          <span class="big-rating red--text text--darken-3">
            0<span class="big-percent">%</span>
          </span>
        </span>
      </div>
    </div>
    <div class="divider"></div>
    <ul class="row">
      <li v-for="article in articles" :key="article.id" class="row">
        <div class="col m8 l9">
          <div class="article-image col m3 l2">
            <router-link
              :to="{ name: 'view-article', params: { articleId: article.id } }"
            >
              <v-img
                v-if="article.urlToImage"
                height="105px"
                :src="article.urlToImage"
              ></v-img>
            </router-link>
          </div>
          <div class="col m9 l10">
            <div class="title-name">
              <router-link
                :to="{
                  name: 'view-article',
                  params: { articleId: article.id }
                }"
              >
                {{ article.title }}
              </router-link>
            </div>
            <div>
              <router-link
                v-if="article.author"
                :to="{
                  name: 'view-author',
                  params: { author: article.author }
                }"
              >
                <span class="author-name"> by {{ article.author }} </span>
              </router-link>
              <span class="source-time">
                &ensp;{{ article.publishedAt | moment('MMMM Do') }}
              </span>
            </div>
          </div>
        </div>
        <div class="col s12 m4 l3">
          <div v-if="!isMobile()" class="col m6">
            <span class="green-circle"> </span>
            <span class="rating green--text" v-if="article.averageRating">
              {{ article.averageRating }}<span class="percent">%</span>
            </span>
            <span class="rating green--text" v-else> NA </span>
          </div>
          <div v-if="!isMobile()" class="col m6">
            <span v-if="!article.averageBiasRating">
              <span class="red-circle"></span>
              <span class="rating red--text text--darken-3"> NA </span>
            </span>
            <span v-if="article.right">
              <span class="red-circle"></span>
              <span class="rating red--text text--darken-3">
                {{ article.averageBiasRating
                }}<span class="percent">%</span></span
              >
            </span>
            <span v-if="article.left">
              <span class="blue-circle"></span>
              <span class="rating blue--text text--darken-2">
                {{ article.averageBiasRating }}<span class="percent">%</span>
              </span>
            </span>
            <span v-if="article.neutral">
              <span class="red-circle"></span>
              <span class="rating red--text text--darken-3">
                0<span class="percent">%</span>
              </span>
            </span>
          </div>
          <div v-if="isMobile()" class="col s12">
            <span class="green-circle"> </span>
            <span class="rating green--text" v-if="article.averageRating">
              {{ article.averageRating }}<span class="percent">%</span>
            </span>
            <span class="rating green--text" v-else> NA </span>
            <span v-if="!article.averageBiasRating">
              <span class="red-circle"></span>
              <span class="rating red--text text--darken-3"> NA </span>
            </span>
            <span v-if="article.right">
              <span class="red-circle"></span>
              <span class="rating red--text text--darken-3">
                {{ article.averageBiasRating }}<span class="percent">%</span>
              </span>
            </span>
            <span v-if="article.left">
              <span class="blue-circle"></span>
              <span class="rating blue--text text--darken-2">
                {{ article.averageBiasRating }}<span class="percent">%</span>
              </span>
            </span>
            <span v-if="article.neutral">
              <span class="red-circle"></span>
              <span class="rating red--text text--darken-3">
                0<span class="percent">%</span>
              </span>
            </span>
          </div>
        </div>
      </li>
      <li>
        <div id="return-home" class="col s12">
          <router-link to="/">
            <v-btn outline flat color="green" depressed> Home </v-btn>
          </router-link>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import db from '../fb';
import checkIfLogoExists from '../mixins/checkIfLogoExists';

export default {
  name: 'ViewSource',
  mixins: [checkIfLogoExists],
  data() {
    return {
      articles: [],
      sourceName: null,
      sourceUrl: null,
      sourceId: null,
      averageRating: null,
      urlToImage: null,
      marginL: null,
      containerWidth: null,
      windowWidth: null,
      averageBiasRating: null,
      left: null,
      right: null,
      neutral: null
    };
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
  created() {
    if (this.isDesktop()) this.containerWidth = 1010;
    else if (this.isLap()) this.containerWidth = 860;
    else if (this.isLandScape()) this.containerWidth = 710;
    else if (this.isTablet()) this.containerWidth = 660;
    else this.containerWidth = this.windowWidth;
    this.marginL = (window.innerWidth - this.containerWidth) / 2;
    this.sourceName = this.$route.params.sourceName;
    db.collection('sources')
      .doc(this.sourceName)
      .get()
      .then(doc => {
        if (doc.exists) {
          if (doc.data().averageRating)
            this.averageRating = Math.trunc(doc.data().averageRating * 10);
          this.sourceUrl = doc.data().sourceUrl;
          this.sourceId = doc.data().id;
          this.averageBiasRating = doc.data().averageBiasRating;
          if (this.averageBiasRating < 4) {
            this.averageBiasRating = Math.trunc(
              (4 - this.averageBiasRating) / 0.03
            );
            this.left = true;
          } else if (this.averageBiasRating > 4) {
            this.averageBiasRating = Math.trunc(
              (this.averageBiasRating - 4) / 0.03
            );
            this.right = true;
          } else if (this.averageBiasRating == 4) {
            this.averageBiasRating = 4;
            this.neutral = true;
          }
        } else {
          // doc.data() will be undefined in this case
          console.log('No such what!');
        }
      });
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
            publishedAt: doc.data().publishedAt,
            ratingCount: doc.data().ratingCount,
            urlToImage: doc.data().urlToImage
          };
          this.articles.push(data);
        });
      });
  },
  methods: {
    getImgUrl(id) {
      if (this.checkIfLogoExists(id)) {
        return require('../assets/images/' + id + '.png');
      } else return null;
    },
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
    }
  }
};
</script>

<style scoped>
a {
  color: black;
}
.v-btn {
  margin-left: 0px;
  margin-right: 0px;
}
.source-image {
  border: 0.75px solid #b7b1b1;
  height: 64px;
  border-radius: 50%;
  position: relative;
  top: 13px;
}
.source-title {
  font-size: 50px;
  margin-bottom: 5px;
  font-weight: 300;
}
.source-rating {
  padding-left: 10px;
  margin-bottom: 20px;
}
div {
  font-family: Helvetica, Arial, sans-serif;
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
  background-color: #4caf50;
  border-radius: 50%;
  display: inline-block;
}
.red-circle {
  position: relative;
  top: 5px;
  height: 22px;
  width: 22px;
  background-color: #c62828;
  border-radius: 50%;
  display: inline-block;
}
.blue-circle {
  position: relative;
  top: 5px;
  height: 22px;
  width: 22px;
  background-color: #1e88e5;
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
.source-time {
  font-size: 12px;
  opacity: 0.71;
}
.article-image {
  margin-top: 3px;
}
.big-rating {
  font-size: 22px;
  font-weight: bold;
}
.big-green-circle {
  position: relative;
  top: 5px;
  height: 25px;
  width: 25px;
  background-color: #4caf50;
  border-radius: 50%;
  display: inline-block;
}
.big-red-circle {
  position: relative;
  top: 5px;
  height: 25px;
  width: 25px;
  background-color: #c62828;
  border-radius: 50%;
  display: inline-block;
}
.big-blue-circle {
  position: relative;
  top: 5px;
  height: 25px;
  width: 25px;
  background-color: #1e88e5;
  border-radius: 50%;
  display: inline-block;
}
.divider {
  margin-bottom: 30px;
  height: 2px;
  margin-left: 10.5px;
  margin-right: 10.5px;
}
#return-home {
  margin-top: 20px;
}
.big-percent {
  font-size: 17px;
  position: relative;
  bottom: 2px;
  left: 1px;
  margin-right: 6px;
}
.percent {
  font-size: 14px;
  position: relative;
  bottom: 1px;
  left: 1px;
}
@media screen and (max-width: 800px) {
  .green-circle {
    position: relative;
    top: 3px;
    height: 18px;
    width: 18px;
  }
  .red-circle {
    position: relative;
    top: 3px;
    height: 18px;
    width: 18px;
  }
  .blue-circle {
    position: relative;
    top: 3px;
    height: 18px;
    width: 18px;
  }
  .rating {
    font-size: 16px;
  }
  .title-name {
    font-size: 18px;
  }
  .source-title {
    font-size: 46px;
  }
}
@media screen and (max-width: 760px) {
  .article-image {
    display: none;
  }
  .rating {
    margin-right: 5px;
  }
  .source-rating {
    padding-left: 12px;
  }
  .source-title {
    padding-left: 6px;
  }
  .divider {
    margin-left: 12.5px;
    margin-right: 12.5px;
  }
}
@media screen and (max-width: 600px) {
  .source-title {
    font-size: 42px;
  }
  .source-image {
    height: 60px;
  }
  .big-green-circle {
    width: 22px;
    height: 22px;
    top: 4px;
  }
  .big-red-circle {
    width: 22px;
    height: 22px;
    top: 4px;
  }
  .big-rating {
    font-size: 20px;
  }
  .divider {
    margin-bottom: 25px;
  }
}
@media screen and (max-width: 480px) {
  .source-title {
    font-size: 38px;
  }
  .source-image {
    height: 58px;
  }
}
</style>
