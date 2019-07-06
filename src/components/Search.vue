<template>
  <ais-instant-search :search-client="searchClient" index-name="articles">
    <ais-search-box class="input-field">
      <div slot="submit-icon"></div>
    </ais-search-box>

    <ais-state-results>
      <div slot-scope="{ query }">
        <ais-hits v-if="query.length > 0">
          <v-list slot-scope="{ items }">
            <v-list-tile
              v-for="item in items"
              :key="item.objectID"
              :to="{
                name: 'view-article',
                params: { articleId: item.objectID }
              }"
            >
              <v-list-tile-avatar>
                <img :src="item.urlToImage" />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-sub-title v-text="item.title">
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </ais-hits>
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
        'XJF7Q2DMQT',
        '71f803c7d53e0a3e2c47b4aa59a428fc'
      )
    };
  }
};
</script>
