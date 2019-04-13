const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

exports.newsapi = functions.https.onRequest((request, response) => {
  const url =
    'https://newsapi.org/v2/top-headlines?country=us&apiKey=583dc1c927234dae9e0a79b2b9556dce';

  const getData = async url => {
    try {
      const response = await axios.get(url);
      const data = response.data;
      if (data.status === 'ok') {
        data.articles.forEach(element => {
          if (element.author) {
            element.author = element.author.replace(/\//g, ',');

            var authorRef = admin
              .firestore()
              .collection('authors')
              .doc(element.author);

            authorRef
              .get()
              .then(doc => {
                if (!doc.exists) {
                  authorRef.set({
                    sources: [element.source.name]
                  });
                } else {
                  var sources = doc.data().sources;
                  if (!sources.includes(element.source.name)) {
                    sources.push(element.source.name);
                    authorRef.update({
                      sources: sources
                    });
                  }
                }
                return null;
              })
              .catch(error => {
                console.log('Error getting document:', error);
              });
          }

          if (element.source.name) {
            element.source.name = element.source.name.replace(/\//g, ',');

            var sourceRef = admin
              .firestore()
              .collection('sources')
              .doc(element.source.name);

            sourceRef
              .get()
              .then(doc => {
                if (!doc.exists) {
                  var sourceUrl = 'https://' + element.url.split('/')[2];
                  sourceRef.set({
                    sourceUrl: sourceUrl
                  });
                }
                return null;
              })
              .catch(error => {
                console.log('Error getting document:', error);
              });
          }

          admin
            .firestore()
            .collection('articles')
            .add(element);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  getData(url);
  response.send('Success!');
});
