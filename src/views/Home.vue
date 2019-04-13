<template>
  <div id="home">
    <!-- <LowestRated /> -->
    <ul class="collection with-header">
      <li class="collection-header">
        <h4>Top U.S. Headlines, updated everyday</h4>
      </li>
      <li v-for="article in articles" :key="article.id" class="collection-item">
        <span class="title">
          <router-link
            :to="{ name: 'view-article', params: { articleId: article.id } }"
          >
            <v-img
              v-if="article.urlToImage"
              height="350px"
              :src="article.urlToImage"
            ></v-img>
            <br />
            {{ article.title }}
          </router-link>
        </span>
        <span>{{ article.publishedAt | moment('MMMM Do YYYY, h:mm a') }}</span>
        <p>{{ article.description }}</p>
        <p>
          <span
            class="badge new"
            data-badge-caption="%"
            v-if="article.averageRating"
          >
            Accuracy rating: {{ article.averageRating }}
          </span>

          <router-link
            v-if="article.sourceName"
            class="chip"
            :to="{
              name: 'view-source',
              params: { sourceName: article.sourceName }
            }"
          >
            {{ article.sourceName }}
          </router-link>

          <router-link
            v-if="article.author"
            class="chip"
            :to="{ name: 'view-author', params: { author: article.author } }"
          >
            <i class="fa fa-user"></i>
            {{ article.author }}
          </router-link>
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
import db from '../fb';
// import LowestRated from '../components/LowestRated';

export default {
  name: 'Home',
  // components: {
  //   LowestRated
  // },
  data() {
    return {
      articles: []
    };
  },
  created() {
    db.collection('articles')
      .orderBy('publishedAt')
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
