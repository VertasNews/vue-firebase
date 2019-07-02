<template>
  <div id="view-article" :style="{marginLeft: marginL + 'px', width: containerWidth + 'px'}">
    <div class="card">
      <div class="card-content row">
            <div class="col s12 m3">
             <v-img v-if="urlToImage" height="250px" :src="urlToImage"></v-img>
            </div>
            <div class="col s12 m9">
              <div class="title-name"> <a :href="url" target="_blank">{{ title }}</a> </div>
              <div ><router-link
              v-if="sourceName"
              :to="{
                name: 'view-source',
                params: { sourceName: sourceName }
              }"
            >
             <span class ="source-name"> {{ sourceName }} </span>
            </router-link> </div>
            <div class="authorntime">
            <router-link
              v-if="author"
              :to="{ name: 'view-author', params: { author: author } }"
            >
             <span class = "author-name"> {{ author.replace(/,/g, '/') }} </span>
            </router-link>
            <span class = "source-time">{{ publishedAt | moment('MMMM Do YYYY, h:mm a') }}</span>
             </div>
             <div class="article-content fade"> <a :href="url" target="_blank">{{ content }} </a> </div>
             
            </div>
      </div> 
    </div>
    <div class = "card"> 
      <div class = "card-content">
        <div class="row">
        
       
        <div class="col s6 m3 text-xs-center borderRight1">
          <div class="col s12 score-title"> Critics Score  </div> 
          <div class="col s6 accuracy-rate"> NA  </div> 
          <div class="col s6 bias-rate red--text"> NA </div>
          <div class="col s6 rating-num">  0 rating(s) </div> 
          <div class="col s6 rating-num"> 0 rating(s) </div>
          </div>
        <div class= "col s6 m3 text-xs-center borderRight2">
          <div class="col s12 score-title"> Users Score  </div> 
          <div v-if="averageRating" class="col s6 accuracy-rate"> {{averageRating}}% </div> 
          <div v-else class="col s6 accuracy-rate"> NA </div> 
          <div v-if="left" class="col s6 bias-rate blue--text"> {{ averageBiasRating }}%  </div>
          <div v-if="right" class="col s6 bias-rate red--text"> {{ averageBiasRating }}%  </div>
          <div v-if="neutral" class="col s6 bias-rate grey--text"> 0%</div>
          <div v-if="!averageBiasRating" class="col s6 bias-rate red--text"> NA </div>
          <div class="col s6 rating-num"> {{ratingCount}} rating(s) </div> 
          <div class="col s6 rating-num"> {{biasRatingCount}} rating(s) </div>
           </div>
        <div class="col s12 m6 text-xs-center">
          <div class="rating-instruction"> Please provide us with an objective rating of the article's accuracy and biases </div>
          <div> <RatingPopup v-if="popup" />  </div>
       <!--    -->
           </div>
  
        </div>

      </div>
    </div>
   <!-- <span class="badge new blue" data-badge-caption="" v-if="left">
              {{ averageBiasRating }}% Left
            </span>
            <span class="badge new red" data-badge-caption="" v-if="right">
              {{ averageBiasRating }}% Right
            </span>
            <span class="badge" data-badge-caption="" v-if="neutral">
              Neutral, no bias
            </span>
            <v-card-actions>
              Accuracy:
              <v-rating
                v-model="userRating"
                :length="10"
                background-color="green lighten-3"
                color="green"
                @click.native="submitRating"
              >
              </v-rating>
              {{ userRating }}0%
            </v-card-actions>
             
            <v-slider
              v-model="biasRating"
              :tick-labels="tickLabels"
              :max="7"
              :min="1"
              step="1"
              always-dirty
              
      
         :track-color="color"
              :color="color"
              @click.native="submitBiasRating"
            ></v-slider>  -->
           
    <router-link to="/"> 
            <v-btn id="return-home" outline flat color="green" depressed> Home </v-btn>
        </router-link>
  </div>

</template>

<script>
import db from '../fb';
import firebase from 'firebase';
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
      userId: null,
      ratingId: null,
      hasRating: false,
      hasBiasRating: false,
      userRating: null,
      oldRating: null,
      biasRating: null,
      oldBiasRating: null,
      tickLabels: [
        'Left-3',
        'Left-2',
        'Left-1',
        'Neutral',
        'Right-1',
        'Right-2',
        'Right-3'
      ],
      left: false,
      neutral: false,
      right: false,
      windowWidth: null,
      marginL: null,
      containerWidth: null
    };
  },
  created() {
    this.articleId = this.$route.params.articleId;
    this.userId = firebase.auth().currentUser.uid;
    this.ratingId = this.articleId + this.userId;

    db.collection('ratings')
      .doc(this.ratingId)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.userRating = doc.data().value;
          this.oldRating = doc.data().value;
          this.hasRating = true;
        } else {
          // doc.data() will be undefined in this case
          console.log('No rating found!');
         
        }
      });

    db.collection('biasRatings')
      .doc(this.ratingId)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.biasRating = doc.data().value;
          this.oldBiasRating = doc.data().value;
          this.hasBiasRating = true;
        } else {
          // doc.data() will be undefined in this case
          console.log('No bias rating found!');
        }
      });
    if (this.isDesktop())
      this.containerWidth = 1050
    else if (this.isLap())
      this.containerWidth = 900
    else if (this.isTablet())
      this.containerWidth = 700
    else 
      this.containerWidth = this.windowWidth
    this.marginL = (window.innerWidth - this.containerWidth) / 2
  },
  mounted() {
    window.addEventListener('resize', () => {
        if (this.isDesktop())
          this.containerWidth = 1050
        else if (this.isLap())
          this.containerWidth = 900
        else if (this.isTablet())
          this.containerWidth = 700
        else 
          this.containerWidth = this.windowWidth
        this.marginL = (this.windowWidth - this.containerWidth  ) / 2
    })
  },
  computed: {
    color() {
      if (this.biasRating == 1) return 'blue';
      if (this.biasRating == 2) return 'blue lighten-2';
      if (this.biasRating == 3) return 'blue lighten-3';
      if (this.biasRating == 4) return 'green lighten-2';
      if (this.biasRating == 5) return 'red lighten-3';
      if (this.biasRating == 6) return 'red lighten-2';
      if (this.biasRating == 7) return 'red ';
      return 'grey';
    }
  },
  beforeRouteEnter(to, from, next) {
    db.collection('articles')
      .doc(to.params.articleId)
      .get()
      .then(doc => {
        next(vm => {
          if (doc.exists) {
            vm.author = doc.data().author;
            vm.sourceName = doc.data().source.name;
            vm.title = doc.data().title;
            vm.url = doc.data().url;
            vm.description = doc.data().description;
            vm.content = doc.data().content;
            vm.urlToImage = doc.data().urlToImage;
            vm.publishedAt = doc.data().publishedAt;
            if (doc.data().averageRating) {
              vm.averageRating = Math.trunc(doc.data().averageRating * 10);
            vm.ratingCount = doc.data().ratingCount;
            }
            else {
              vm.ratingCount = 0;
              console.log('No rating');
            }
            if (!doc.data().averageBiasRating) {
              vm.biasRatingCount = 0;
              console.log ('No bias rating')
            }
            else {
              vm.biasRatingCount = doc.data().biasRatingCount;
              if (doc.data().averageBiasRating < 4) {
                vm.averageBiasRating = Math.trunc(
                  (4 - doc.data().averageBiasRating) / 0.03
                );
                vm.left = true;
              } 
              else if (doc.data().averageBiasRating > 4) {
                vm.averageBiasRating = Math.trunc(
                  (doc.data().averageBiasRating - 4) / 0.03
                );
                vm.right = true;
              } 
              else if (doc.data().averageBiasRating == 4) {
                vm.averageBiasRating = 4;
                vm.neutral = true;
              }
            }
          }
        });
      });
  },
  watch: {
    $route: 'fetchData'
  },
  methods: {
    fetchData() {
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
            }
            else 
              this.ratingCount = 0;
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
            console.log('dkmmemay2');
            this.biasRatingCount = 0;
          }
        });
    },
    isLap (){
      return ( this.windowWidth <= 1100 && this.windowWidth > 800)
    },
    isDesktop (){
      this.windowWidth = window.innerWidth
      return ( this.windowWidth > 1100)
    },
    isTablet (){
      return ( this.windowWidth <= 800 && this.windowWidth > 760 )
    },
    isMobile (){
      return ( this.windowWidth <= 760)
    }
    
  }
};
</script>
<style scoped>
a {
  color: black;
}
div {
  font-family: Helvetica,Arial,sans-serif;
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
  color: #0CD7E8;
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
  color: #4CAF50;
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
  height: 80px/* exactly three lines */
}
.fade:after {
  content: "";
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10%;
  height: 20px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0),#ffffff 50%);
}
@media screen and (max-width: 800px) {
.accuracy-rate {
  font-size: 50px;
  padding: 0px;
}
.bias-rate {
  font-size: 50px;
  padding: 0px;
}
.rating-num {
  font-size: 11px;
}
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
.card .card-content{
  padding: 20px 0px 20px 0px;
}
}
</style>