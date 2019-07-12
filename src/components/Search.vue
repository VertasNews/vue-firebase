<template>
  <ais-instant-search :search-client="searchClient" index-name="articles">
    <ais-search-box class="input-field" placeholder="Search for articles">
    </ais-search-box>
    <ais-powered-by />
    <ais-configure :hits-per-page.camel="4" />

    <ais-state-results>
      <div slot-scope="{ query }">
        <ais-infinite-hits v-if="query.length > 0">
          <v-list slot-scope="{ items, refine }">
            <v-list-tile
              v-for="item in items"
              :key="item.objectID"
              :to="{
                name: 'view-article',
                params: { articleId: item.objectID }
              }"
            >
              <v-list-tile-avatar>
                <v-img :src="item.urlToImage">
                  <template v-slot:placeholder>
                    <v-layout fill-height align-center justify-center ma-0>
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-layout>
                  </template>
                </v-img>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-sub-title v-text="item.title">
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <button class="ais-InfiniteHits-loadMore" @click="refine()">
                Show more results
              </button>
            </v-list-tile>
          </v-list>

          <!--   slot-scope="{ page, isLastPage, refineNext }" -->
        </ais-infinite-hits>
      </div>
    </ais-state-results>
  </ais-instant-search>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import 'instantsearch.css/themes/algolia-min.css';

export default {
  data() {
    return {
      searchClient: algoliasearch(
        process.env.VUE_APP_ALGOLIA_ID,
        process.env.VUE_APP_ALGOLIA_ADMIN_KEY
      )
    };
  }
};
</script>
<style>
@media screen and (min-width: 440px) {
  .input-field input[type='search'] {
    padding: 0.3rem 0 0 2rem;
    height: 38px;
    width: 88%;
    border-bottom: none;
  }
}
@media screen and (max-width: 440px) {
  .input-field input[type='search'] {
    padding: 0.3rem 0 0 0.5rem;
    font-size: 20px;
  }
  .ais-SearchBox-submit {
    display: none;
  }
}
.ais-SearchBox-form {
  line-height: 1.5;
  height: auto;
}
.ais-SearchBox-submit {
  left: 0.4rem;
}
</style>
<style scoped>
.ais-InfiniteHits-loadMore {
  background: transparent;
  color: #a5aed1;
  font-size: 1rem;
}
.ais-PoweredBy {
  position: absolute;
  top: 0;
  right: 2px;
}
.ais-InstantSearch {
  position: relative;
  height: 100%;
  font-family: Helvetica, Arial, sans-serif;
}
</style>
