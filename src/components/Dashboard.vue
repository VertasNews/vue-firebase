<template>
  <div id="dashboard">
    <ul class="collection with-header">
      <li class="collection-header">
        <h4>Articles</h4>
      </li>
      <li v-for="article in articles" v-bind:key="article.id" class="collection-item">
        <router-link
          class="chip"
          v-bind:to="{name: 'view-publisher', 
            params: {publisher_name: article.publisher_name, 
            publisher_url: getPublisherURL(article.url)}}"
        >
            {{ article.publisher_name }}
        </router-link>

         <router-link
          class="chip"
          v-bind:to="{name: 'view-author', params: {author_name: article.author_name}}"
        >
            <i class="fa fa-user"></i>
            {{ article.author_name }}
        </router-link>

        <a :href="article.url" target="_blank">{{ article.title }}</a>
      </li>
    </ul>

    <div class="fixed-action-btn">
      <router-link to="/new" class="btn-floating btn-large blue">
        <i class="fa fa-plus"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
import db from './firebaseInit';
import getPublisherURL from '../mixins/getPublisherURL';
export default {
  name: 'dashboard',
  data() {
    return {
      articles: []
    };
  },
  created() {
    db.collection('articles')
      .orderBy('publisher_name')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            author_name: doc.data().author_name,
            publisher_name: doc.data().publisher_name,
            title: doc.data().title,
            url: doc.data().url
          };
          this.articles.push(data);
        });
      });
  },
    mixins: [getPublisherURL]
};
</script>
