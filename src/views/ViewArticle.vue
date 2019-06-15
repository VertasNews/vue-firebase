<template>
  <div id="view-article" class="container">
    <!-- <v-layout>
      <v-flex>
        <v-card>
          <v-img v-if="urlToImage" :src="urlToImage"></v-img>
          <v-card-title>
            <h5>
              <a :href="url" target="_blank">{{ title }}</a>
            </h5>
            <span>{{ publishedAt | moment('MMMM Do YYYY, h:mm a') }}</span>
            <span class="badge new" data-badge-caption="%" v-if="averageRating">
              Accuracy rating: {{ averageRating }}
            </span>
          </v-card-title>
          <v-card-actions>
            Rate this article accuracy
            <v-rating
              v-model="userRating"
              :length="10"
              @click.native="submitRating"
            >
            </v-rating>
            {{ userRating }}0%
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout> -->
    <div class="card">
      <div class="card-content row collection">
            <div class="col s1">
            <v-img  v-if="urlToImage" height="200px" :src="src/assets/plus_sign_demo.png"></v-img> 
            </div>
            <div class="col s8">
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
             <div> <a :href="url" target="_blank">{{ content }} </a> </div>
             
            </div>
         
         <!--   <span class="badge new" data-badge-caption="%" v-if="averageRating">
              Accuracy rating: {{ averageRating }}
            </span>
            <v-card-actions>
              Accuracy:
              <v-rating
                v-model="userRating"
                :length="10"
                @click.native="submitRating"
              >
              </v-rating>
              {{ userRating }}0%
            </v-card-actions>
             <v-slider
              v-model="biasRating"
              :tick-labels="ticksLabels"
              :max="8"
              step="2"
              always-dirty
              ticks="always"
              tick-size="2"
              track-color="green"
              color="green"
            ></v-slider> -->
      
        
      
      </div>
        
    </div>
    <div class = "card"> 
      <div class = "card-content">
        <div class="row">
        <div class=" col s12 rating-header"> 
          <div class = "col 1 borderRight"> Article </div>
          <div class= "col 1 borderRight"> News Outlet </div>
          <div class = "col 1"> Author </div>

        </div>
       
        <div class="col s3 text-xs-center borderRight">
          <div class="col s12 score-title"> Critics Score  </div> 
          <div class="col s6 accuracy-rate"> NA  </div> 
          <div class="col s6 bias-rate"> NA </div>
          <div class="col s6"> no of ratings </div> 
          <div class="col s6"> no of rating </div>
          </div>
        <div class= "col s3 text-xs-center borderRight">
          <div class="col s12 score-title"> Users Score  </div> 
          <div v-if="averageRating" class="col s6 accuracy-rate"> {{averageRating}}% </div> 
          <div v-if="!averageRating" class="col s6 accuracy-rate"> NA </div> 
          <div class="col s6 bias-rate"> NA </div>
          <div class="col s6"> {{ratingCount}} rating(s) </div> 
          <div class="col s6"> no of rating </div>
           </div>
        <div class="col s6 text-xs-center">
          <div class="rating-instruction"> Please provide us with an objective rating of the article's accuracy and biases </div>
          <div> <v-btn large round color = "success"> Rate Now </v-btn> </div>
           </div>
  
        </div>

      </div>
    </div>
    <router-link to="/" class="btn grey">Home</router-link>
  </div>

</template>

<script>
import db from '../fb';
import firebase from 'firebase';


export default {
  name: 'ViewArticle',
  data() {
    return {
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
      userRating: null,
      userRatingId: null,
      oldRating: null,
      biasRating: 4,
      ticksLabels: ['Left', 'Semi-left', 'Centrist', 'Semi-right', 'Right']
    };
  },
  created() {
    this.articleId = this.$route.params.articleId;
    db.collection('ratings')
      .where('userId', '==', firebase.auth().currentUser.uid)
      .where('articleId', '==', this.articleId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.exists) {
            this.userRating = doc.data().value;
            this.oldRating = doc.data().value;
            this.userRatingId = doc.id;
          } else {
            // doc.data() will be undefined in this case
            console.log('No rating found!');
          }
        });
      });
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
            if (doc.data().averageRating)
              vm.averageRating = Math.trunc(doc.data().averageRating * 10);
            vm.ratingCount = doc.data().ratingCount;
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
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
            if (doc.data().averageRating)
              this.averageRating = Math.trunc(doc.data().averageRating * 10);
            this.ratingCount = doc.data().ratingCount;
          } else {
            console.log('No such document!');
          }
        });
    },
    addRatingToFirebase(reference, rating, oldRating) {
      // User already rated the article
      if (this.userRatingId) {
        return db.runTransaction(transaction => {
          return transaction.get(reference).then(doc => {
            if (!doc.exists) {
              throw 'Document does not exist!';
            }

            var oldRatingTotal =
              doc.data().averageRating * doc.data().ratingCount;
            var newAvgRating =
              (oldRatingTotal - oldRating + rating) / doc.data().ratingCount;

            transaction.update(reference, {
              averageRating: newAvgRating
            });
          });
        });
      } else {
        // User rate news for the first time
        return db.runTransaction(transaction => {
          return transaction.get(reference).then(doc => {
            if (!doc.exists) {
              throw 'Document does not exist!';
            }

            if (doc.data().ratingCount && doc.data().averageRating) {
              var newNumRatings = doc.data().ratingCount + 1;
              var oldRatingTotal =
                doc.data().averageRating * doc.data().ratingCount;
              var newAvgRating = (oldRatingTotal + rating) / newNumRatings;

              transaction.update(reference, {
                ratingCount: newNumRatings,
                averageRating: newAvgRating
              });
            } else {
              transaction.update(reference, {
                ratingCount: 1,
                averageRating: rating
              });
            }
          });
        });
      }
    },
    submitRating() {
      var rating = this.userRating;
      var oldRating = this.oldRating;
      this.oldRating = rating;

      var articleRef = db.collection('articles').doc(this.articleId);
      var user = firebase.auth().currentUser;

      this.addRatingToFirebase(articleRef, rating, oldRating);

      if (this.author) {
        var authorRef = db.collection('authors').doc(this.author);
        this.addRatingToFirebase(authorRef, rating, oldRating);
      }
      if (this.sourceName) {
        var sourceRef = db.collection('sources').doc(this.sourceName);
        this.addRatingToFirebase(sourceRef, rating, oldRating);
      }

      if (this.userRatingId) {
        db.collection('ratings')
          .doc(this.userRatingId)
          .update({
            value: rating
          });
      } else {
        db.collection('ratings').add({
          articleId: this.articleId,
          userId: user.uid,
          value: rating
        });
      }
    }
  }
};
</script>
<style scoped>

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
  font-size: 60px;
  font-weight: bold;
  color: #438007;
}
.bias-rate {
  font-size: 60px;
  font-weight: bold;
  color: #B20000;
}
.borderRight {
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

</style>