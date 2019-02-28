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
        // eslint-disable-next-line
        .then(docRef => this.$router.push('/'))
        .catch(error => console.log(error));
    }
  }
};
</script>
