export default {
  methods: {
    getSourceMainUrl(url) {
      return 'https://' + url.split('/')[2];
    }
  }
};
