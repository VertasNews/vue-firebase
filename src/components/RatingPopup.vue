<template>
  <v-dialog max-width="600px" v-model="dialog">
    <v-btn
      v-if="userId"
      class="round-button"
      :large="!isMedium"
      slot="activator"
      color="success"
    >
      Rate Now
    </v-btn>
    <v-btn
      v-else
      class="round-button"
      :large="!isMedium"
      slot="activator"
      color="success"
      to="/login"
    >
      Rate Now
    </v-btn>
    <v-alert
      :value="alert"
      type="error"
      transition="scale-transition"
      icon="new_releases"
      dismissible
    >
      Please choose a rating before making a vote
    </v-alert>
    <v-card class="text-xs-center scrollLock" height="170px" light>
      <div id="accuracy-page">
        <div class="rate-title">
          Accuracy Rate
        </div>
        <div>
          <v-rating
            v-model="userRating"
            :length="10"
            background-color="green lighten-1"
            color="green"
            hover
            @click.native="changeAccuracyVote"
            :small="isSmall"
          >
          </v-rating>
        </div>
        <div>
          <v-btn small v-if="accuracyVoteSubmitted" color="success">
            Voted &ensp; <v-icon dark> check_circle </v-icon>
          </v-btn>
          <v-btn
            small
            v-else
            @click.native="submitRating"
            color="success"
            outline
          >
            Vote
          </v-btn>
          <span v-if="accuracyVoteSubmitted" id="next-icon">
            <v-icon @click="switchRight" color="green"> fas fa-forward </v-icon>
          </span>
        </div>
        <div class="message" v-if="accuracyVoteSubmitted">
          You can always change your vote!
        </div>
      </div>
      <div id="bias-page" class="slide" :class="slide()">
        <div class="rate-title">
          Bias Rate
        </div>
        <v-slider
          class="slider"
          v-model="biasRating"
          :tick-labels="tickLabels"
          :max="7"
          :min="1"
          step="1"
          always-dirty
          @click.native="changeBiasVote"
          :track-color="color"
          :color="color"
        ></v-slider>
        <div>
          <span v-if="biasVoteSubmitted" id="prev-icon">
            <v-icon @click="switchLeft" color="green"> fas fa-backward </v-icon>
          </span>
          <v-btn
            small
            class="voted-button"
            v-if="biasVoteSubmitted"
            color="success"
          >
            Voted &ensp; <v-icon dark> check_circle </v-icon>
          </v-btn>
          <v-btn
            small
            id="vote-button"
            v-else
            @click.native="submitBiasRating"
            color="success"
            outline
          >
            Vote
          </v-btn>
        </div>
        <div class="message" v-if="biasVoteSubmitted">
          You can always change your vote!
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import db from '../fb';

export default {
  data() {
    return {
      loading: false,
      dialog: false,
      articleId: null,
      author: null,
      sourceName: null,
      userId: null,
      ratingId: null,
      hasRating: false,
      hasBiasRating: false,
      userRating: null,
      oldRating: null,
      biasRating: null,
      oldBiasRating: null,
      tickLabels: ['Left', '', '', 'Neutral', '', '', 'Right'],
      switchs: false,
      accuracyVoteSubmitted: false,
      biasVoteSubmitted: false,
      windowWidth: null,
      alert: false
    };
  },
  created() {
    this.articleId = this.$route.params.articleId;
    this.userId = firebase.auth().currentUser.uid;
    this.ratingId = this.articleId + this.userId;
    this.windowWidth = window.innerWidth;
    db.collection('ratings')
      .doc(this.ratingId)
      .get()
      .then(doc => {
        if (doc.exists) {
          //user has voted this before
          this.userRating = doc.data().value;
          this.oldRating = doc.data().value;
          this.hasRating = true;
          this.accuracyVoteSubmitted = this.hasRating;
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
          this.biasVoteSubmitted = this.hasBiasRating;
        }
      });
    db.collection('articles')
      .doc(this.articleId)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.author = doc.data().author;
          this.sourceName = doc.data().source.name;
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      });
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
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
    },
    isSmall() {
      return this.windowWidth < 480;
    },
    isMedium() {
      return this.windowWidth < 760;
    }
  },
  methods: {
    submitRating() {
      if (this.userRating == null) {
        this.alert = true;
        setTimeout(() => {
          this.alert = false;
        }, 3000);
      } else {
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
          // user has voted before
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
        this.accuracyVoteSubmitted = true;
        setTimeout(this.switchRight, 1000);
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
      if (this.biasRating == null) {
        this.alert = true;
        setTimeout(() => {
          this.alert = false;
        }, 3000);
      } else {
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
        this.biasVoteSubmitted = true;
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
    },
    switchRight() {
      this.switchs = true;
    },
    switchLeft() {
      this.switchs = false;
    },
    slide() {
      if (this.switchs) return 'slides';
    },
    changeAccuracyVote() {
      this.accuracyVoteSubmitted = false;
    },
    changeBiasVote() {
      this.biasVoteSubmitted = false;
    } //setTimeout(function() {, 1000);
  }
};
</script>

<style scoped>
div {
  font-family: Helvetica, Arial, sans-serif;
}
.v-btn {
  margin: 0;
}
.round-button {
  border-radius: 10px;
}
.slide {
  position: relative;
  left: 100%;
  bottom: 150px;
  transition: 1s;
  background: white;
}
.slides {
  left: 0;
}
.slider {
  padding-left: 5px;
  padding-right: 5px;
  height: 50px;
  margin-top: 0px;
}
.voted-button {
  height: 30px;
}
.rate-title {
  margin-top: 10px;
  font-size: 18px;
}
#accuracy-page {
  border: 1px solid #4caf50;
  margin: 0px 10px 10px 10px;
  height: 150px;
  position: relative;
  top: 10px;
}
#bias-page {
  border: 1px solid #4caf50;
  margin: 0px 10px 10px 10px;
  height: 150px;
}
#next-icon {
  position: relative;
  top: 5px;
  left: 15px;
}
.message {
  font-size: 12px;
  margin-top: 4px;
}
#prev-icon {
  position: relative;
  top: 5px;
  right: 15px;
}
#vote-button {
  position: relative;
  top: 7px;
}
.scrollLock {
  overflow-x: hidden;
  overflow-y: hidden;
}
@media screen and (max-width: 370px) {
  .rate-title {
    margin-top: 8px;
    font-size: 14px;
  }
  .slider {
    height: auto;
  }
}
</style>
