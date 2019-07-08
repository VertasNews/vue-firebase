<template>
  <div id="home">
    <LowestRated />
    <div
      style="position: sticky; top: 0px; z-index: 1; margin-bottom: 10px; margin-top: 5px;"
    >
      <div
        id="header"
        :style="{
          marginLeft: marginL + 3 + 'px',
          width: containerWidth - 270 + 'px'
        }"
      >
        <button id="add-article">
          <router-link to="/new_article" id="add-article-router">
            <img
              src="../assets/plus_sign_demo.png"
              style="height: 25px; position: relative; top: 5px; "
            />
            Add Article
          </router-link>
        </button>
        <div id="header-icon">
          <span class="green-circle"></span>
          <span class="trl green-text right-margin "> TRUTH </span>
          <span class="red-circle"></span>
          <span class="trl red-text right-margin"> RIGHT </span>
          <span class="blue-circle"></span>
          <span class="trl blue-text"> LEFT </span>
        </div>
      </div>
    </div>
    <div v-if="!isMobile()" style=" position: sticky; top: 100px;">
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
              <span class="author-name"
                >&ensp; by {{ article.author }}
              </span>
            </router-link>
          </div>
          <div class="description fade">{{ article.description }}</div>
          <div class="rate-row">
            <span class="green-circle"></span>
            <span class="green-rating" v-if="!article.averageRating"> NA </span>
            <span class="green-rating" v-if="article.averageRating">
              {{ article.averageRating }}%
            </span>
            <span class="red-circle"></span>
            <span class="red-rating" data-badge-caption="%"> NA </span>
            <router-link
              :to="{ name: 'view-article', params: { articleId: article.id } }"
            >
              <span class="rate">
                <img
                  src="../assets/rating.png"
                  style="height: 18px; opacity: 0.81; position: relative; top: 4px;"
                />
                RATE
              </span>
            </router-link>
            <span class="read">
              <a :href="article.url" target="_blank">
                <img
                  src="../assets/read-book-icon-12.jpg"
                  style="height: 18px; opacity: 0.81; position: relative; top: 4px; "
                />
                READ
              </a>
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
      containerWidth: null
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
    else if (this.isTablet()) this.containerWidth = 700;
    this.marginL = (this.windowWidth - this.containerWidth) / 2 + 20;
    if (this.isMobile()) {
      this.containerWidth = this.windowWidth + 250;
      this.marginL = 10;
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      if (this.isDesktop()) this.containerWidth = 1050;
      else if (this.isLap()) this.containerWidth = 900;
      else if (this.isTablet()) this.containerWidth = 700;
      this.marginL = (this.windowWidth - this.containerWidth) / 2 + 20;
      if (this.isMobile()) {
        this.containerWidth = this.windowWidth + 250;
        this.marginL = 10;
      }
    });
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
      return this.windowWidth <= 1100 && this.windowWidth > 800;
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
.article-img {
  float: left;
  width: 250px;
  height: 150px;
  margin-right: 10px;
}
li p {
  margin-bottom: 10px;
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
  background-color: #b20000;
  border-radius: 50%;
  display: inline-block;
}
.blue-circle {
  height: 22px;
  width: 22px;
  background-color: #075b80;
  border-radius: 50%;
  display: inline-block;
}
.green-rating {
  color: #4caf50;
  position: relative;
  bottom: 5px;
  font-size: 18px;
  font-weight: bold;
}
.red-rating {
  color: #b20000;
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
  position: relative;
  top: 42px;
  width: 80px;
  height: 36px;
  background: white;
  border-radius: 10px;
  border: 1px solid #b7b1b1;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 16px;
  padding: 0;
  margin-bottom: 10px;
}
#add-article-router {
  display: inline-block;
  width: 100%;
  height: 100%;
}
#header {
  height: 90px;
  padding: 10px 0px 10px 0px;
  background: white;
}
#header-icon {
  text-align: right;
}
.trl {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-weight: bold;
  position: relative;
  bottom: 5px;
}
.red-text {
  color: #b20000;
}
.green-text {
  color: #4caf50;
}
.blue-text {
  color: #075b80;
}
.right-margin {
  margin-right: 20px;
}
.sticky {
  top: 50px;
  position: fixed;
}
/*
#add-article:hover {
  transition: 1s;
  width: 135px;
}*/

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
  height: 50px;
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
  padding-right: 20px;
}
</style>
