<template>
  <div id="popular-weekly">
    <ul class="collection with-header">
      <li class="collection-header">
        <h5>Popular Weekly</h5>
      </li>
      <li v-for="article in articles" :key="article.id" class="collection-item">
        <router-link
          :to="{ name: 'view-article', params: { articleId: article.id } }"
          >{{ article.title }}</router-link
        >
        <span
          class="badge new"
          data-badge-caption="%"
          v-if="article.averageRating"
          >Accuracy rating: {{ article.averageRating }}</span
        >
      </li>
    </ul>
  </div>
</template>

<script>
import db from '../fb';

export default {
  name: 'PopularWeekly',
  data() {
    return {
      articles: []
    };
  },
  created() {
    let now = new Date();
    let onejan = new Date(now.getFullYear(), 0, 1);
    var week = Math.ceil(((now - onejan) / 86400000 + onejan.getDay() + 1) / 7);

    db.collection('articles')
      .where('week', '==', week)
      .orderBy('ratingCount', 'desc')
      .limit(10)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.data().averageRating) {
            var avgRatingRounded = Math.trunc(doc.data().averageRating * 10);
          }
          const data = {
            id: doc.id,
            author: doc.data().author,
            sourceName: doc.data().source.name,
            title: doc.data().title,
            url: doc.data().url,
            urlToImage: doc.data().urlToImage,
            description: doc.data().description,
            content: doc.data().content,
            publishedAt: doc.data().publishedAt,
            averageRating: avgRatingRounded,
            ratingCount: doc.data().ratingCount
          };
          this.articles.push(data);
        });
      });
  }
};
</script>
