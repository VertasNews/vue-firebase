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
          if (
            element.urlToImage &&
            !element.source.name.includes('Youtube') &&
            !element.source.name.includes('Facebook')
          ) {
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
                      id: element.source.id,
                      sourceUrl: sourceUrl
                    });
                  }
                  return null;
                })
                .catch(error => {
                  console.log('Error getting document:', error);
                });
            }
            let now = new Date(element.publishedAt);
            let onejan = new Date(now.getFullYear(), 0, 1);
            var week = Math.ceil(
              ((now - onejan) / 86400000 + onejan.getDay() + 1) / 7
            );

            admin
              .firestore()
              .collection('articles')
              .add({
                author: element.author,
                source: {
                  id: element.source.id,
                  name: element.source.name
                },
                title: element.title,
                url: element.url,
                urlToImage: element.urlToImage,
                description: element.description,
                content: element.content,
                publishedAt: element.publishedAt,
                week: week
              });
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  getData(url);
  response.send('Success!');
});
