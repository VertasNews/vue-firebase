<template>
  <div id="dashboard">
    <ul class="collection with-header">
      <li class="collection-header">
        <h4>Articles</h4>
      </li>
      <li v-for="article in articles" :key="article.id" class="collection-item">
        <span class="title">
          <router-link
            :to="{name: 'view-article', params: {articleId: article.id}}"
          >
              {{ article.title }}
          </router-link>
        </span>
        <p>
        <router-link
          class="chip"
          :to="{name: 'view-source', 
            params: {sourceName: article.sourceName, 
            url: article.url}}"
        >
            {{ article.sourceName }}
        </router-link>

         <router-link
          class="chip"
          :to="{name: 'view-author', params: {author: article.author}}"
        >
            <i class="fa fa-user"></i>
            {{ article.author }}
        </router-link>

        <span class="badge new" data-badge-caption="/ 10">
          count: {{ article.scoreCount }}, 
          average: {{ article.averageScore }}
        </span>
        </p>
      </li>
    </ul>

    <div class="fixed-action-btn">
      <router-link to="/new_article" class="btn-floating btn-large blue">
        <i class="fa fa-plus"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
import db from './firebaseInit';

export default {
  name: 'Dashboard',
  data() {
    return {
      articles: []
    };
  },
  created() {
    db.collection('articles')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.data().averageScore) {
            var avgScoreRounded = doc.data().averageScore.toFixed(2);
          }
          const data = {
            id: doc.id,
            author: doc.data().author,
            sourceName: doc.data().source.name,
            title: doc.data().title,
            url: doc.data().url,
            averageScore: avgScoreRounded,
            scoreCount: doc.data().scoreCount
          };
          this.articles.push(data);
        });
      });
  }
};
</script>
