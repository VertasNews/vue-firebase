export default {
  methods: {
    getPublisherURL(url) {
      return 'https://' + url.split('/')[2];
    }
  }
};
