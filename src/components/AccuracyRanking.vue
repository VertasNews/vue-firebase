<template>
  <div id="accuracy-ranking">
    <div
      v-if="!isMobile()"
      id="accuracyRanking"
      :style="{ right: marginL - 7 + 'px' }"
    >
      <div class="chart-title">Outlets Accuracy Rank</div>
      <ul>
        <li
          v-for="source in sources"
          :key="source.name"
          class="collection-item"
        >
          <router-link
            :to="{
              name: 'view-source',
              params: { sourceName: source.name }
            }"
          >
            <v-avatar size="32px" v-if="getImgUrl(source.id)">
              <img class="img-circle mb-1" :src="getImgUrl(source.id)" />
            </v-avatar>
            <span class="source-name" v-else>
              {{ source.name }}
            </span>
          </router-link>
          <span :style="{ width: source.length + 'px' }" class="ranking-bar">
          </span>
          <span class="rating-num" v-if="source.averageRating">
            {{ source.averageRating }}<span class="percent">%</span></span
          >
        </li>
      </ul>
      <div id="popWeekly" class="chart-title">Popular Weekly</div>
      <ul>
        <li v-for="article in articles" :key="article.id" class="row">
          <div class="green-rating col s2" v-if="article.averageRating">
            {{ article.averageRating }}<span class="percent">%</span>
          </div>
          <div class="article-title col s10 fade">
            <router-link
              :to="{ name: 'view-article', params: { articleId: article.id } }"
              >{{ article.title }}</router-link
            >
          </div>
        </li>
      </ul>
    </div>
    <div v-if="isMobile()" class="row">
      <div id="popWeek" class="col s6 m7">
        <div id="popWeekly" class="chart-title">Popular Weekly</div>
        <ul>
          <li v-for="article in articles" :key="article.id" class="row">
            <div class="green-rating col s2" v-if="article.averageRating">
              {{ article.averageRating }}<span class="percent">%</span>
            </div>
            <div class="article-title col s10 fade">
              <router-link
                :to="{
                  name: 'view-article',
                  params: { articleId: article.id }
                }"
                >{{ article.title }}</router-link
              >
            </div>
          </li>
        </ul>
      </div>
      <div id="outlet-wrapper" class="col s6 m5">
        <div id="outletRank" class="chart-title">Outlets Accuracy Rank</div>
        <ul>
          <li
            v-for="source in sources"
            :key="source.name"
            class="collection-item"
          >
            <router-link
              :to="{
                name: 'view-source',
                params: { sourceName: source.name }
              }"
            >
              <v-avatar size="32px" v-if="getImgUrl(source.id)">
                <img class="img-circle mb-1" :src="getImgUrl(source.id)" />
              </v-avatar>
              <span class="source-name" v-else>
                {{ source.name }}
              </span>
            </router-link>
            <span
              v-if="isSmallMobile()"
              :style="{
                width: source.averageRating * 0.006 * windowWidth + 'px'
              }"
              class="ranking-bar"
            >
            </span>
            <span
              v-else
              :style="{ width: source.length + 'px' }"
              class="ranking-bar"
            >
            </span>
            <span class="rating-num" v-if="source.averageRating">
              {{ source.averageRating }}<span class="percent">%</span></span
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import db from '../fb';
import checkIfLogoExists from '../mixins/checkIfLogoExists';

export default {
  name: 'AccuracyRanking',
  mixins: [checkIfLogoExists],
  data() {
    return {
      sources: [],
      articles: [],
      marginL: null,
      containerWidth: null,
      windowWidth: null
    };
  },
  created() {
    db.collection('sources')
      .orderBy('averageRating', 'desc')
      .limit(6)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.data().averageRating) {
            var avgRatingRounded = Math.trunc(doc.data().averageRating * 10);
            var rankLength = avgRatingRounded * 1.34;
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
    let now = new Date();
    let onejan = new Date(now.getFullYear(), 0, 1);
    var week = Math.ceil(((now - onejan) / 86400000 + onejan.getDay() + 1) / 7);

    db.collection('articles')
      .where('week', '==', week)
      .orderBy('ratingCount', 'desc')
      .limit(5)
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
            urlToImage: doc.data().urlToImage,
            description: doc.data().description,
            content: doc.data().content,
            publishedAt: doc.data().publishedAt,
            averageRating: avgRatingRounded,
            ratingCount: doc.data().ratingCount
          };
          this.articles.push(data);
        });
      });
    if (this.isDesktop()) this.containerWidth = 1050;
    else if (this.isLap()) this.containerWidth = 900;
    else if (this.isLandScape()) this.containerWidth = 810;
    else if (this.isTablet()) this.containerWidth = 700;
    else this.containerWidth = this.windowWidth;
    this.marginL = (window.innerWidth - this.containerWidth) / 2;
  },
  mounted() {
    window.addEventListener('resize', () => {
      if (this.isDesktop()) this.containerWidth = 1050;
      else if (this.isLap()) this.containerWidth = 900;
      else if (this.isLandScape()) this.containerWidth = 810;
      else if (this.isTablet()) this.containerWidth = 700;
      else this.containerWidth = this.windowWidth;
      this.marginL = (this.windowWidth - this.containerWidth) / 2;
    });
  },
  methods: {
    getImgUrl(id) {
      if (this.checkIfLogoExists(id)) {
        return require('../assets/images/' + id + '.png');
      } else console.log('deo thay gi');
      return null;
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
    isSmallMobile() {
      return this.windowWidth <= 500;
    }
  }
};
</script>

<style scoped>
a {
  color: black;
}
.chart-title {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
.ranking-bar {
  border-radius: 50px;
  height: 12px;
  background-color: #4caf50;
  display: inline-block;
  margin-top: 10px;
}
#accuracyRanking {
  position: absolute;
  border-radius: 10px;
  width: 250px;
  height: 600px;
  /* border: 1px solid #B7B1B1; */
  padding: 10px 10px 10px 10px;
}
.v-avatar {
  margin-right: 10px;
  margin-bottom: 5px;
}
.rating-num {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #4caf50;
}
.source-name {
  font-size: 12px;
  display: inline-block;
  width: 42px;
  overflow: hidden;
}
#chart-title {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
.green-rating {
  color: #4caf50;
  font-size: 16px;
  font-weight: bold;
  padding-left: 3.5px;
}
.article-title {
  font-weight: bold;
  overflow: hidden;
  /*  position: relative; */
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
#popWeekly {
  margin-top: 10px;
}
.percent {
  font-size: 14px;
  position: relative;
  bottom: 1px;
  left: 1px;
}
@media screen and (max-width: 900px) {
  #accuracyRanking {
    width: 240px;
  }
}
@media screen and (max-width: 760px) {
  #chart-title {
    margin-top: 10px;
  }
  .col {
    padding-left: 15px;
  }
  #outletRank {
    margin-top: 10px;
  }
}
@media screen and (max-width: 500px) {
  .col {
    width: 100%;
  }
  #popWeek {
    width: 100%;
  }
  #outlet-wrapper {
    width: 100%;
  }
}
</style>
