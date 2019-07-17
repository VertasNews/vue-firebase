<template>
  <div id="new-article" class="container row">
    <div id="na-content" class="col s12 m8 xl6 offset-m2 offset-xl3 card-panel">
      <h3>New Article</h3>
      <div class="row">
        <form @submit.prevent="saveArticle" class="col s12">
          <div class="row">
            <div class="input-field col s11">
              <input type="text" v-model="title" required />
              <label class="active">Title</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s11">
              <input type="text" v-model="url" required />
              <label class="active">URL</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s11">
              <input type="text" v-model="sourceName" required />
              <label class="active">Source Name</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s11">
              <input type="text" v-model="author" required />
              <label class="active">Author</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s11">
              <input type="text" v-model="description" />
              <label class="active">Description</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s11">
              <input type="text" v-model="content" />
              <label class="active">Content</label>
            </div>
          </div>
          <button type="submit" class="btn green">Submit</button>
          <router-link to="/" class="btn grey">Cancel</router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import db from '../fb';
import getSourceMainUrl from '../mixins/getSourceMainUrl';

export default {
  name: 'NewArticle',
  mixins: [getSourceMainUrl],
  data() {
    return {
      sourceName: null,
      author: null,
      title: null,
      url: null,
      description: null,
      content: null
    };
  },
  methods: {
    saveArticle() {
      db.collection('articles')
        .add({
          source: {
            id: '',
            name: this.sourceName
          },
          author: this.author,
          title: this.title,
          url: this.url,
          description: this.description,
          content: this.content,
          submitBy: firebase.auth().currentUser.uid
        })
        .catch(error => console.log(error));

      var authorRef = db.collection('authors').doc(this.author);
      var sourceRef = db.collection('sources').doc(this.sourceName);

      authorRef
        .get()
        .then(doc => {
          if (!doc.exists) {
            authorRef.set({
              sources: [this.sourceName]
            });
          } else {
            var sources = doc.data().sources;
            if (!sources.includes(this.sourceName)) {
              sources.push(this.sourceName);
              authorRef.update({
                sources: sources
              });
            }
          }
        })
        .catch(function(error) {
          console.log('Error getting document:', error);
        });

      sourceRef
        .get()
        .then(doc => {
          if (!doc.exists) {
            var sourceUrl = this.getSourceMainUrl(this.url);
            sourceRef.set({
              sourceUrl: sourceUrl
            });
          }
          this.$router.push('/');
        })
        .catch(function(error) {
          console.log('Error getting document:', error);
        });
    }
  }
};
</script>

<style scoped>
#na-content {
  padding-left: 25px;
  padding-right: 25px;
}
.row > #na {
  padding: 20x;
}
input[type='text']:not(.browser-default):focus:not([readonly]) {
  border-bottom: 1px solid #4caf50;
  -webkit-box-shadow: 0 1px 0 0 #4caf50;
  box-shadow: 0 1px 0 0 #4caf50;
}
input[type='text']:not(.browser-default):focus:not([readonly]) + label {
  color: #4caf50;
}
.card-panel {
  border: 1px solid green;
}
</style>
