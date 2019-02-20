export default {
  methods: {
    getSourceURL(url) {
      return 'https://' + url.split('/')[2];
    }
  }
};
