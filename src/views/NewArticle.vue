<template>
  <div id="new-article">
    <h3>New Article</h3>
    <div class="row">
      <form @submit.prevent="saveArticle" class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="sourceName" required />
            <label class="active">Source Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="author" required />
            <label class="active">Author</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="title" required />
            <label class="active">Title</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="url" required />
            <label class="active">URL</label>
          </div>
        </div>
        <button type="submit" class="btn">Submit</button>
        <router-link to="/" class="btn grey">Cancel</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import db from '../fb';
import getSourceMainUrl from '../mixins/getSourceMainUrl';

export default {
  name: 'NewArticle',
  data() {
    return {
      sourceName: null,
      author: null,
      title: null,
      url: null
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
          url: this.url
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
  },
  mixins: [getSourceMainUrl]
};
</script>
