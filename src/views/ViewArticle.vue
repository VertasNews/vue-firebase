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
            <span class="badge new blue" data-badge-caption="" v-if="left">
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
            ></v-slider>
            <a :href="url" target="_blank">{{ content }}</a>
          </div>
          <v-card-actions>
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
              {{ author.replace(/,/g, '/') }}
            </router-link>
          </v-card-actions>
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
      right: false
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
            if (doc.data().averageRating)
              vm.averageRating = Math.trunc(doc.data().averageRating * 10);
            vm.ratingCount = doc.data().ratingCount;
            if (doc.data().averageBiasRating < 4) {
              vm.averageBiasRating = Math.trunc(
                (4 - doc.data().averageBiasRating) / 0.03
              );
              vm.left = true;
            } else if (doc.data().averageBiasRating > 4) {
              vm.averageBiasRating = Math.trunc(
                (doc.data().averageBiasRating - 4) / 0.03
              );
              vm.right = true;
            } else if (doc.data().averageBiasRating == 4) {
              vm.averageBiasRating = 4;
              vm.neutral = true;
            }
            vm.biasRatingCount = doc.data().biasRatingCount;
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
          } else {
            console.log('No such document!');
          }
        });
    },
    submitRating() {
      var rating = this.userRating;
      var oldRating = this.oldRating;
      this.oldRating = rating;

      var articleRef = db.collection('articles').doc(this.articleId);
      this.addRatingToFirebase(articleRef, rating, oldRating);

      if (this.author) {
        var authorRef = db.collection('authors').doc(this.author);
        this.addRatingToFirebase(authorRef, rating, oldRating);
      }
      if (this.sourceName) {
        var sourceRef = db.collection('sources').doc(this.sourceName);
        this.addRatingToFirebase(sourceRef, rating, oldRating);
      }

      if (this.hasRating) {
        db.collection('ratings')
          .doc(this.ratingId)
          .update({
            value: rating
          });
      } else {
        db.collection('ratings')
          .doc(this.ratingId)
          .set({
            articleId: this.articleId,
            userId: this.userId,
            value: rating
          });
      }
    },
    addRatingToFirebase(reference, rating, oldRating) {
      // User already rated the article
      if (this.hasRating) {
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

            this.hasRating = true;

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
    submitBiasRating() {
      var rating = this.biasRating;
      var oldRating = this.oldBiasRating;
      this.oldBiasRating = rating;

      var articleRef = db.collection('articles').doc(this.articleId);
      this.addBiasRatingToFirebase(articleRef, rating, oldRating);

      if (this.author) {
        var authorRef = db.collection('authors').doc(this.author);
        this.addBiasRatingToFirebase(authorRef, rating, oldRating);
      }
      if (this.sourceName) {
        var sourceRef = db.collection('sources').doc(this.sourceName);
        this.addBiasRatingToFirebase(sourceRef, rating, oldRating);
      }

      if (this.hasBiasRating) {
        db.collection('biasRatings')
          .doc(this.ratingId)
          .update({
            value: rating
          });
      } else {
        db.collection('biasRatings')
          .doc(this.ratingId)
          .set({
            articleId: this.articleId,
            userId: this.userId,
            value: rating
          });
      }
    },
    addBiasRatingToFirebase(reference, rating, oldRating) {
      // User already rated the article
      if (this.hasBiasRating) {
        return db.runTransaction(transaction => {
          return transaction.get(reference).then(doc => {
            if (!doc.exists) {
              throw 'Document does not exist!';
            }

            var oldRatingTotal =
              doc.data().averageBiasRating * doc.data().biasRatingCount;
            var newAvgRating =
              (oldRatingTotal - oldRating + rating) /
              doc.data().biasRatingCount;

            transaction.update(reference, {
              averageBiasRating: newAvgRating
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

            this.hasBiasRating = true;

            if (doc.data().biasRatingCount && doc.data().averageBiasRating) {
              var newNumRatings = doc.data().biasRatingCount + 1;
              var oldRatingTotal =
                doc.data().averageBiasRating * doc.data().biasRatingCount;
              var newAvgRating = (oldRatingTotal + rating) / newNumRatings;

              transaction.update(reference, {
                biasRatingCount: newNumRatings,
                averageBiasRating: newAvgRating
              });
            } else {
              transaction.update(reference, {
                biasRatingCount: 1,
                averageBiasRating: rating
              });
            }
          });
        });
      }
    }
  }
};
</script>
