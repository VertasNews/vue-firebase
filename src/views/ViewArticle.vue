<template>
  <div id="view-article">
    <div class="row">
      <div class="col s12">
        <div class="card">
          <div class="card-content">
            <span class="card-title">{{ title }}</span>
            <span class="badge new" data-badge-caption="/ 10">
              count: {{ scoreCount }}, average: {{ averageScore }}
            </span>
            <star-rating
              @rating-selected="addRating(articleId, $event, currentUserScore)"
              :rating="currentUserScore"
              :round-start-rating="false"
              :max-rating="10"
              :star-size="20"
            >
            </star-rating>
            <a :href="url" target="_blank"> {{ url }} </a>
          </div>
          <div class="card-action">
            <router-link
              class="chip blue-text"
              :to="{
                name: 'view-source',
                params: { sourceName: sourceName, url: url }
              }"
            >
              {{ sourceName }}
            </router-link>
            <router-link
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
      averageScore: null,
      scoreCount: null,
      currentUserScore: null,
      curUserScoreId: null
    };
  },
  created() {
    this.articleId = this.$route.params.articleId;
    db.collection('scores')
      .where('userId', '==', firebase.auth().currentUser.uid)
      .where('articleId', '==', this.articleId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.exists) {
            this.currentUserScore = doc.data().value;
            this.curUserScoreId = doc.id;
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
            vm.averageScore = doc.data().averageScore.toFixed(2);
            vm.scoreCount = doc.data().scoreCount;
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
            this.averageScore = doc.data().averageScore;
            this.scoreCount = doc.data().scoreCount;
          } else {
            console.log('No such document!');
          }
        });
    },
    addRating(articleId, rating, old_rating) {
      var articleRef = db.collection('articles').doc(articleId);
      var user = firebase.auth().currentUser;

      console.log(this.curUserScoreId);
      if (this.curUserScoreId) {
        db.collection('scores')
          .doc(this.curUserScoreId)
          .update({
            value: rating
          });

        return db.runTransaction(transaction => {
          return transaction.get(articleRef).then(doc => {
            if (!doc.exists) {
              throw 'Document does not exist!';
            }

            if (doc.data().scoreCount && doc.data().averageScore) {
              var oldRatingTotal =
                doc.data().averageScore * doc.data().scoreCount;
              var newAvgRating =
                (oldRatingTotal - old_rating + rating) / doc.data().scoreCount;

              transaction.update(articleRef, {
                averageScore: newAvgRating
              });
            }
          });
        });
      } else {
        db.collection('scores').add({
          articleId: this.articleId,
          userId: user.uid,
          value: rating
        });

        return db.runTransaction(transaction => {
          return transaction.get(articleRef).then(doc => {
            if (!doc.exists) {
              throw 'Document does not exist!';
            }

            if (doc.data().scoreCount && doc.data().averageScore) {
              var newNumRatings = doc.data().scoreCount + 1;
              var oldRatingTotal =
                doc.data().averageScore * doc.data().scoreCount;
              var newAvgRating = (oldRatingTotal + rating) / newNumRatings;

              transaction.update(articleRef, {
                scoreCount: newNumRatings,
                averageScore: newAvgRating
              });
            } else {
              transaction.update(articleRef, {
                scoreCount: 1,
                averageScore: rating
              });
            }
          });
        });
      }
    }
  }
};
</script>
