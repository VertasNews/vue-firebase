export default {
  methods: {
    getSourceUrl(url) {
      return 'https://' + url.split('/')[2];
    }
  }
};
