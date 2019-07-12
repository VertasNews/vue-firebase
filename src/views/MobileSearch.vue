<template>
  <div v-if="windowWidth < 440" id="mobile-search">
    <Search />
  </div>
</template>

<script>
import Search from '../components/Search';
export default {
  name: 'MobileSearch',
  components: {
    Search
  },
  data() {
    return {
      windowWidth: null
    };
  },
  created() {
    this.windowWidth = window.innerWidth;
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
  }
};
</script>
