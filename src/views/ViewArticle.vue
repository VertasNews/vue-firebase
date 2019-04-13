<template>
  <div id="view-article">
    <div class="row">
      <div class="col s12">
        <div class="card">
          <div class="card-content">
            <v-img v-if="urlToImage" height="350px" :src="urlToImage"></v-img>
            <h5>
              <a :href="url" target="_blank">{{ title }}</a>
            </h5>
            <span>{{ publishedAt | moment('MMMM Do YYYY, h:mm a') }}</span>
            <span class="badge new" data-badge-caption="%" v-if="averageRating">
              Accuracy rating: {{ averageRating }}
            </span>
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
            <!-- <v-slider
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
            <a :href="url" target="_blank">{{ content }}</a>
          </div>
          <div class="card-action">
            <router-link
              v-if="sourceName"
              class="chip blue-text"
              :to="{
                name: 'view-source',
                params: { sourceName: sourceName }
              }"
            >
              {{ sourceName }}
            </router-link>
            <router-link
              v-if="author"
              class="chip blue-text"
              :to="{ name: 'view-author', params: { author: author } }"
            >
              <i class="fa fa-user"></i>
              {{ author }}
            </router-link>
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
      var authorRef = db.collection('authors').doc(this.author);
      var sourceRef = db.collection('sources').doc(this.sourceName);
      var user = firebase.auth().currentUser;

      this.addRatingToFirebase(articleRef, rating, oldRating);
      this.addRatingToFirebase(authorRef, rating, oldRating);
      this.addRatingToFirebase(sourceRef, rating, oldRating);

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
