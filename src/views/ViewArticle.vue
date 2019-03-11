<template>
  <div id="view-article">
    <div class="row">
      <div class="col s12">
        <div class="card">
          <div class="card-content">
            <span class="card-title">{{ title }}</span>
            <span class="badge new" data-badge-caption="/ 10">
              count: {{ ratingCount }}, average: {{ averageRating }}
            </span>
            <v-rating
              v-model="currentUserRating"
              :length="10"
              @click.native="submitRating"
            >
            </v-rating>
            <a :href="url" target="_blank"> {{ url }} </a>
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
      averageRating: null,
      ratingCount: null,
      currentUserRating: null,
      currentUserRatingId: null,
      oldRating: null
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
            this.currentUserRating = doc.data().value;
            this.oldRating = doc.data().value;
            this.currentUserRatingId = doc.id;
          } else {
            // doc.data() will be undefined in this case
            console.log('No such what!');
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
            if (doc.data().averageRating)
              vm.averageRating = doc.data().averageRating.toFixed(2);
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
            this.averageRating = doc.data().averageRating;
            this.ratingCount = doc.data().ratingCount;
          } else {
            console.log('No such document!');
          }
        });
    },
    addRating(reference, rating, oldRating) {
      // User already rated the article
      if (this.currentUserRatingId) {
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
      var rating = this.currentUserRating;
      var oldRating = this.oldRating;
      this.oldRating = rating;

      var articleRef = db.collection('articles').doc(this.articleId);
      var authorRef = db.collection('authors').doc(this.author);
      var sourceRef = db.collection('sources').doc(this.sourceName);
      var user = firebase.auth().currentUser;

      this.addRating(articleRef, rating, oldRating);
      this.addRating(authorRef, rating, oldRating);
      this.addRating(sourceRef, rating, oldRating);

      if (this.currentUserRatingId) {
        db.collection('ratings')
          .doc(this.currentUserRatingId)
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
