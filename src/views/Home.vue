<template>
  <div id="home">
    <!-- <LowestRated /> -->
    <ul class="collection with-header">
      <li class="collection-header">
        <h4>Top U.S. Headlines</h4>
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
            >Accuracy rating: {{ article.averageRating }}</span
          >

          <router-link
            v-if="article.sourceName"
            class="chip"
            :to="{
              name: 'view-source',
              params: { sourceName: article.sourceName }
            }"
            >{{ article.sourceName }}</router-link
          >

          <router-link
            v-if="article.author"
            class="chip"
            :to="{ name: 'view-author', params: { author: article.author } }"
          >
            <i class="fa fa-user"></i>
            {{ article.author.replace(/,/g, '/') }}
          </router-link>
        </p>
      </li>
    </ul>

    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10"
    >
      ...
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
      articles: [],
      lastVisible: null,
      next: null,
      busy: false
    };
  },
  created() {
    var first = db
      .collection('articles')
      .orderBy('publishedAt', 'desc')
      .limit(10);

    first.get().then(querySnapshot => {
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

      this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      console.log('last', this.lastVisible);

      // Construct a new query starting at this document,
      this.next = db
        .collection('articles')
        .orderBy('publishedAt', 'desc')
        .startAfter(this.lastVisible)
        .limit(10);
    });

    console.log('articles', this.articles);
  },
  methods: {
    loadMore: function() {
      this.busy = true;

      setTimeout(() => {
        this.next.get().then(querySnapshot => {
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

          this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
          if (!this.lastVisible) {
            this.busy = true;
            return;
          }

          // Construct a new query starting at this document,
          this.next = db
            .collection('articles')
            .orderBy('publishedAt', 'desc')
            .startAfter(this.lastVisible)
            .limit(10);
        });
        this.busy = false;
      }, 1000);
    }
  }
};
</script>
