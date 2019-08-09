<template>
  <div id="lowest-rated">
    <v-card color="grey lighten-2">
      <div id="lowestRateTitle" class="text-xs-center">
        LOWEST RATED ARTICLES
      </div>
      <vueper-slides
        class="no-shadow"
        :visible-slides="slideNum"
        :slide-ratio="1 / 5"
        :dragging-distance="70"
        :slide-multiple="true"
        fixed-height="260px"
        disable-arrows-on-edges
        :breakpoints="breakpoints"
      >
        <v-icon id="arrow-left" slot="arrowLeft" color="black" large>
          fas fa-angle-left</v-icon
        >
        <v-icon id="arrow-right" slot="arrowRight" color="black" large>
          fas fa-angle-right</v-icon
        >
        <vueper-slide v-for="article in articles" :key="article.id">
          <div slot="slideContent">
            <div>
              <router-link
                :to="{
                  name: 'view-article',
                  params: { articleId: article.id }
                }"
              >
                <v-img
                  v-if="article.urlToImage"
                  height="150px"
                  :width="containerWidth + 'px'"
                  :src="article.urlToImage"
                >
                  <template v-slot:placeholder>
                    <v-layout fill-height align-center justify-center ma-0>
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-layout>
                  </template>
                </v-img>
              </router-link>
            </div>
            <router-link
              :to="{ name: 'view-article', params: { articleId: article.id } }"
            >
              <div class="text-xs-left article-title fade">
                {{ article.title }}
              </div>
            </router-link>
            <span v-if="article.averageRating != 100" :class="rating()">
              {{ article.averageRating }}
            </span>
            <span v-else :class="smallrating()">
              {{ article.averageRating }}
            </span>
          </div>
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
      articles: [],
      containerWidth: null,
      windowWidth: null,
      breakpoints: {
        2050: {
          arrows: true,
          bullets: false
        },
        500: {
          arrows: false,
          bullets: true
        }
      },
      isWindow: false
    };
  },
  created() {
    let now = new Date();
    let onejan = new Date(now.getFullYear(), 0, 1);
    var week = Math.ceil(((now - onejan) / 86400000 + onejan.getDay() + 1) / 7);

    db.collection('articles')
      .where('week', '==', week)
      .where('averageRating', '>', 0)
      .orderBy('averageRating')
      .limit(8)
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
            ratingCount: doc.data().ratingCount,
            urlToImage: doc.data().urlToImage
          };
          this.articles.push(data);
        });
      });
    this.windowWidth = window.innerWidth;
    if (this.windowWidth >= 1650) this.containerWidth = 0.18 * this.windowWidth;
    else if (this.windowWidth >= 1250)
      this.containerWidth = 0.18 * this.windowWidth;
    else if (this.windowWidth >= 1000)
      this.containerWidth = 0.22 * this.windowWidth;
    else if (this.windowWidth >= 700)
      this.containerWidth = 0.3 * this.windowWidth;
    else if (this.windowWidth >= 500)
      this.containerWidth = 0.45 * this.windowWidth;
    else if (this.windowWidth < 500)
      this.containerWidth = 0.9 * this.windowWidth;

    var platform = window.navigator.platform,
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    if (windowsPlatforms.indexOf(platform) != -1) this.isWindow = true;
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth >= 1650)
        this.containerWidth = 0.18 * this.windowWidth;
      else if (this.windowWidth >= 1250)
        this.containerWidth = 0.18 * this.windowWidth;
      else if (this.windowWidth >= 1000)
        this.containerWidth = 0.22 * this.windowWidth;
      else if (this.windowWidth >= 700)
        this.containerWidth = 0.3 * this.windowWidth;
      else if (this.windowWidth >= 500)
        this.containerWidth = 0.45 * this.windowWidth;
      else if (this.windowWidth < 500)
        this.containerWidth = 0.9 * this.windowWidth;
    });
  },
  computed: {
    slideNum() {
      if (this.windowWidth >= 1650) return 5;
      else if (this.windowWidth >= 1250) return 5;
      else if (this.windowWidth >= 1000) return 4;
      else if (this.windowWidth >= 700) return 3;
      else if (this.windowWidth >= 500) return 2;
      else return 1;
    }
  },
  methods: {
    smallrating() {
      if (this.isWindow) return 'small-rating-win';
      else return 'small-rating';
    },
    rating() {
      if (this.isWindow) return 'rating-win';
      else return 'rating';
    }
  }
};
</script>
<style>
.vueperslides__arrow:focus {
  background-color: transparent;
}
.vueperslides__bullet {
  width: 13px;
  height: 13px;
  background-color: white;
}
.vueperslides__bullet:focus {
  background-color: #4caf50;
}
.vueperslides__bullets {
  height: 43px;
}
.vueperslides__bullet--active {
  border-width: 2px;
  background-color: #4caf50;
}
</style>
<style scoped>
a {
  color: black;
}
div {
  font-family: Helvetica, Arial, sans-serif;
}
/*
.vueperslides {
  touch-action: none;
} */
#lowestRateTitle {
  font-size: 25px;
  padding-top: 5px;
}
.rating {
  position: absolute;
  padding-top: 1px;
  top: 5px;
  left: 5px;
  width: 30px;
  height: 30px;
  font-weight: 800;
  color: white;
  font-size: 20px;
  background-color: #4caf50;
  border-radius: 50%;
  -webkit-font-smoothing: antialiased;
}
.small-rating {
  position: absolute;
  padding-top: 3px;
  top: 5px;
  left: 5px;
  width: 30px;
  height: 30px;
  font-weight: 800;
  color: white;
  font-size: 17px;
  background-color: #4caf50;
  border-radius: 50%;
  -webkit-font-smoothing: antialiased;
}
.rating-win {
  position: absolute;
  padding-top: 1px;
  top: 5px;
  left: 5px;
  width: 30px;
  height: 30px;
  font-weight: 700;
  color: white;
  font-size: 20px;
  background-color: #4caf50;
  border-radius: 50%;
  -webkit-font-smoothing: antialiased;
}
.small-rating-win {
  position: absolute;
  padding-top: 3px;
  top: 5px;
  left: 5px;
  width: 30px;
  height: 30px;
  font-weight: 700;
  color: white;
  font-size: 17px;
  background-color: #4caf50;
  border-radius: 50%;
  -webkit-font-smoothing: antialiased;
}
.article-title {
  overflow: hidden;
  position: relative;
  font-weight: bold;
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
  background: linear-gradient(to right, rgba(255, 255, 255, 0), #e0e0e0 50%);
}
#arrow-left {
  position: relative;
  left: 35px;
  bottom: 156px;
  background-color: transparent;
}
#arrow-right {
  position: relative;
  right: 35px;
  bottom: 156px;
}
@media screen and (max-width: 500px) {
  #arrow-left {
    left: -10px;
  }
  #arrow-right {
    right: 0px;
  }
}
@media screen and (max-width: 380px) {
  #lowestRateTitle {
    font-size: 22px;
  }
}
</style>
