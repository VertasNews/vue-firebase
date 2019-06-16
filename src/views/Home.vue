<template>
  <div id="home">
    <!--<PopularWeekly /> -->
    
    <div style="position: sticky; top: 60px; z-index: 1; margin-bottom: 10px;">
      <div id="header">
      
        <button id="add-article">
          <router-link to="/new_article" id="add-article-router" >
        
          <img
            src="../assets/plus_sign_demo.png"
            style="height: 25px; position: relative; top: 5px; "
          />
          
           
          
         Add Article </router-link>  
        </button> 
        <div id="header-icon">
          <span class = "green-circle"></span>
          <span class="trl green-text right-margin "> TRUTH </span>
          <span class = "red-circle"></span>
          <span class = "trl red-text right-margin"> RIGHT </span>
          <span class = "blue-circle"></span>
          <span class = "trl blue-text"> LEFT </span>
        </div>

            
          
      </div> 
    </div>
    <div style=" position: sticky; top: 150px;"
    > 
      <AccuracyRanking />
    </div>
   <!-- <LowestRated /> -->
    <ul id="articles">
     
      <li v-for="article in articles" :key="article.id" class="collection-item">
     <!--    <span
            class="badge new blue"
            data-badge-caption=""
            v-if="article.left"
          >
            {{ article.averageBiasRating }}% Left
          </span>
          <span
            class="badge new red"
            data-badge-caption=""
            v-if="article.right"
          >
            {{ article.averageBiasRating }}% Right
          </span>
          <span class="badge" data-badge-caption="" v-if="article.neutral">
            Neutral, no bias
          </span>
-->
        <span>
          <router-link
            :to="{ name: 'view-article', params: { articleId: article.id } }"
          >
            <img
              v-if="article.urlToImage"
              class ="article-img"
              :src="article.urlToImage"
              
            >
           
            <span class = "article-title"> {{ article.title }} </span>
           <!-- <span class="article-time">{{ article.publishedAt | moment('MMMM D') }}</span> -->
         </router-link>
        </span>
        
        <div>
            <router-link
            v-if="article.sourceName"
           
            :to="{
              name: 'view-source',
              params: { sourceName: article.sourceName }
            }"
            > <span class="article-source">{{ article.sourceName }}  </span></router-link>
          
        
          <router-link
            v-if="article.author"
            
            :to="{ name: 'view-author', params: { author: article.author } }"
          >
            <span class="article-author">{{ article.author.replace(/,/g, '/') }} </span>
          </router-link>
        </div>
         <p class="article-description" > {{ article.description }}</p>
        
          <p>
          <span class = "green-circle"></span>
          <span class = "green-rating"
            
            
            v-if="!article.averageRating"
            > NA </span
          >
          <span class = "green-rating"
           
            v-if="article.averageRating"
            > {{ article.averageRating }}% </span
          >
          <span class ="red-circle"></span>
          <span class = "red-rating"
            
            data-badge-caption="%"
            
            > NA </span
          >
          <router-link
            :to="{ name: 'view-article', params: { articleId: article.id } }"
          >
           <span class="rate"> <img
            src="../assets/rating.png" style="height: 18px; opacity: 0.81; position: relative; top: 4px;"
          /> RATE </span>
          </router-link>
          <span class="read"> <a :href="article.url" target="_blank"> <img
            src="../assets/read-book-icon-12.jpg" style="height: 18px; opacity: 0.81; position: relative; top: 4px; "> READ </a> </span>
         
         

        </p>
      </li>
    </ul>
    

    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10"
    >
      
    </div> 
  </div>
</template>

<script>
import db from '../fb';
// import LowestRated from '../components/LowestRated';
import AccuracyRanking from '../components/AccuracyRanking';
import PopularWeekly from '../components/PopularWeekly';

export default {
  name: 'Home',
  components: {
    AccuracyRanking,
    PopularWeekly
    // LowestRated
  },
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
        var averageBiasRating = doc.data().averageBiasRating;
        if (averageBiasRating < 4) {
          averageBiasRating = Math.trunc((4 - averageBiasRating) / 0.03);
          var left = true;
        } else if (averageBiasRating > 4) {
          averageBiasRating = Math.trunc((averageBiasRating - 4) / 0.03);
          var right = true;
        } else if (averageBiasRating == 4) {
          averageBiasRating = 4;
          var neutral = true;
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
          ratingCount: doc.data().ratingCount,
          averageBiasRating: averageBiasRating,
          biasRatingCount: doc.data().biasRatingCount,
          left: left,
          neutral: neutral,
          right: right
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

     window.addEventListener('scroll', this.addSticky);
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

            var averageBiasRating = doc.data().averageBiasRating;
            if (averageBiasRating < 4) {
              averageBiasRating = Math.trunc((4 - averageBiasRating) / 0.03);
              var left = true;
            } else if (averageBiasRating > 4) {
              averageBiasRating = Math.trunc((averageBiasRating - 4) / 0.03);
              var right = true;
            } else if (averageBiasRating == 4) {
              averageBiasRating = 4;
              var neutral = true;
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
              ratingCount: doc.data().ratingCount,
              averageBiasRating: averageBiasRating,
              biasRatingCount: doc.data().biasRatingCount,
              left: left,
              neutral: neutral,
              right: right
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
<style scoped>
.article-img {
  float: left;
  width: 250px;
  height: 150px;
  margin-right: 10px;
}
li p {
  margin-bottom: 10px;
}
.article-title {
  color: black;
  font-weight: bold;
  margin-bottom: 0px;
  font-size: 16px;
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.article-source {
  font-weight: bold;
  color: #0CD7E8;
  font-size: 11px;
  margin-right: 10px;
}
li {
  position: relative;
  width: 40%;
  left: 23%;
  min-height: 150px;
  font-family: Helvetica,Arial,sans-serif;
}
.article-author {
  font-size: 11px;
  font-weight: bold;
  color: black;
  opacity: 0.61;
}
.article-description {
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 12px;
}
.article-time {
  font-size: 11px;
  color: black;
  opacity: 0.61;
}
.green-circle {
  height: 22px;
  width: 22px;
  background-color: #4CAF50;
  border-radius: 50%;
  display: inline-block;
}
.red-circle {
  height: 22px;
  width: 22px;
  background-color:#B20000;
  border-radius: 50%;
  display: inline-block;
}
.blue-circle {
  height: 22px;
  width: 22px;
  background-color: #075B80;
  border-radius: 50%;
  display: inline-block;
}
.green-rating {
  color: #438007;
  position: relative;
  bottom: 5px;
  font-size: 18px;
  font-weight: bold;
}
.red-rating {
  color: #B20000;
  position: relative;
  bottom: 5px;
  font-size: 18px;
  font-weight: bold;
}
.read ,.rate{
  float: right;
  color: black;
  font-weight: bold;
  opacity: 0.51;
}
.read:hover, .rate:hover {
  opacity: 1;
}
.rate {
  margin-left: 10px;
}
a {
  color: black;
}
#add-article {
  position: relative;
  top: 35px;
  width: 130px;
  height: 36px;
  background: white;
  border-radius: 10px;
  border: 1px solid #B7B1B1;
  font-family: Helvetica,Arial,sans-serif;
  font-weight: bold;
  font-size: 16px;
  padding: 0;
  margin-bottom: 10px;
}
#add-article-router {
  display: inline-block;
  width: 100%;
  height: 100%;
}
#header {
  position: relative;
  left: 441px;
  height: 90px;
  width: 40%;
  padding: 10px 0px 10px 0px;
  background: white;
}
#header-icon {
  text-align: right;
}
.trl {
  font-family: Helvetica,Arial,sans-serif;
  font-size: 12px;
  font-weight: bold;
  position: relative;
  bottom: 5px;
}
.red-text {
  color: #B20000;
}
.green-text {
  color: #4CAF50;

}
.blue-text {
 color:  #075B80;
}
.right-margin {
  margin-right: 20px;
}
.sticky {
  top: 50px;
  position: fixed;
}


</style>
