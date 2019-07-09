<template>
  <div
    id="view-author"
    :style="{ marginLeft: marginL + 'px', width: containerWidth + 'px' }"
  >
    <div class="author-title">
      {{ author }}
    </div>
    <div class="author-rating">
      <span class="big-green-circle"> </span>
      <span class="big-rating green--text" v-if="averageRating">
        {{ averageRating }}%
      </span>
      <span class="big-rating green--text" v-else> NA </span>
      <span class="big-red-circle"> </span>
      <span class="big-rating red--text"> NA </span>
    </div>
    <div class="divider"></div>
    <ul class="row">
      <li v-for="article in articles" :key="article.id" class="collection-item">
        <div class="col m9">
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
              <span class="source-time">
                {{ article.publishedAt | moment('MMMM Do') }}
              </span>
            </div>
          </div>
        </div>
        <div class="col s12 m3">
          <div v-if="!isMobile()" class="col m6">
            <span class="green-circle"> </span>
            <span class="rating green--text" v-if="article.averageRating">
              {{ article.averageRating }}%
            </span>
            <span class="rating green--text" v-else> NA </span>
          </div>
          <div v-if="!isMobile()" class="col m6">
            <span class="red-circle"> </span>
            <span class="rating red-rating"> NA </span>
          </div>
          <div v-if="isMobile()" class="col s12">
            <span class="green-circle"> </span>
            <span class="rating green--text" v-if="article.averageRating">
              {{ article.averageRating }}%
            </span>
            <span class="rating green--text" v-else> NA </span>
            <span class="red-circle"> </span>
            <span class="rating red-rating"> NA </span>
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

export default {
  name: 'ViewAuthor',
  data() {
    return {
      articles: [],
      author: null,
      averageRating: null,
      ratingCount: null,
      urlToImage: null,
      marginL: null,
      containerWidth: null,
      windowWidth: null
    };
  },
  mounted() {
    window.addEventListener('resize', () => {
      if (this.isDesktop()) this.containerWidth = 1050;
      else if (this.isLap()) this.containerWidth = 900;
      else if (this.isTablet()) this.containerWidth = 700;
      else this.containerWidth = this.windowWidth;
      this.marginL = (this.windowWidth - this.containerWidth) / 2;
    });
  },
  created() {
    if (this.isDesktop()) this.containerWidth = 1050;
    else if (this.isLap()) this.containerWidth = 900;
    else if (this.isTablet()) this.containerWidth = 700;
    else this.containerWidth = this.windowWidth;
    this.marginL = (window.innerWidth - this.containerWidth) / 2;
    this.author = this.$route.params.author;
    db.collection('authors')
      .doc(this.author)
      .get()
      .then(doc => {
        if (doc.exists) {
          if (doc.data().averageRating)
            this.averageRating = Math.trunc(doc.data().averageRating * 10);
          this.ratingCount = doc.data().ratingCount;
        } else {
          // doc.data() will be undefined in this case
          console.log('No such author!');
        }
      });
  },
  beforeRouteEnter(to, from, next) {
    db.collection('articles')
      .where('author', '==', to.params.author)
      .orderBy('publishedAt', 'desc')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            if (doc.data().averageRating) {
              var avgRatingRounded = Math.trunc(doc.data().averageRating * 10);
            }
            const data = {
              id: doc.id,
              sourceName: doc.data().source.name,
              title: doc.data().title,
              url: doc.data().url,
              averageRating: avgRatingRounded,
              ratingCount: doc.data().ratingCount,
              urlToImage: doc.data().urlToImage,
              publishedAt: doc.data().publishedAt
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
        .where('author', '==', this.$route.params.author)
        .orderBy('publishedAt', 'desc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.data().averageRating) {
              var avgRatingRounded = Math.trunc(doc.data().averageRating * 10);
            }
            const data = {
              id: doc.id,
              sourceName: doc.data().source.name,
              title: doc.data().title,
              url: doc.data().url,
              averageRating: avgRatingRounded,
              ratingCount: doc.data().ratingCount,
              urlToImage: doc.data().urlToImage,
              publishedAt: doc.data().publishedAt
            };
            this.articles.push(data);
          });
        });
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
<style scoped>
div {
  font-family: Helvetica, Arial, sans-serif;
}
a {
  color: black;
}
.v-btn {
  margin-left: 0px;
  margin-right: 0px;
}
.author-title {
  font-size: 40px;
}
.author-rating {
  padding-left: 10px;
  margin-bottom: 20px;
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
  background-color: #b20000;
  border-radius: 50%;
  display: inline-block;
}
.divider {
  margin-bottom: 30px;
  height: 2px;
  margin-left: 10.5px;
  margin-right: 10.5px;
}
.article-image {
  margin-top: 3px;
}
.title-name {
  font-weight: bold;
  font-size: 20px;
}
.source-time {
  font-size: 12px;
  opacity: 0.71;
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
  background-color: #b20000;
  border-radius: 50%;
  display: inline-block;
}
.rating {
  position: relative;
  bottom: 0px;
  font-size: 18px;
  font-weight: bold;
}
.red-rating {
  color: #b20000;
}
#return-home {
  margin-top: 20px;
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
  .rating {
    font-size: 16px;
  }
  .title-name {
    font-size: 18px;
  }
}
@media screen and (max-width: 760px) {
  .article-image {
    display: none;
  }
  .rating {
    margin-right: 5px;
  }
  .author-rating {
    padding-left: 12px;
  }
  .divider {
    margin-left: 12.5px;
    margin-right: 12.5px;
  }
  .author-title {
    padding-left: 10px;
  }
}
@media screen and (max-width: 600px) {
  .author-title {
    font-size: 35px;
  }
  .big-green-circle {
    width: 20px;
    height: 20px;
    top: 3px;
  }
  .big-red-circle {
    width: 20px;
    height: 20px;
    top: 3px;
  }
  .big-rating {
    font-size: 20px;
  }
  .divider {
    margin-bottom: 25px;
  }
}
</style>
