[![Netlify Status](https://api.netlify.com/api/v1/badges/737174b8-cdce-4c1a-bdcb-77a3bd64686b/deploy-status)](https://app.netlify.com/sites/vertas/deploys)
[![Known Vulnerabilities](https://snyk.io/test/github/lannvu/vue-firebase/badge.svg?targetFile=package.json&style=flat-square)](https://snyk.io/test/github/lannvu/vue-firebase?targetFile=package.json)
[![HitCount](http://hits.dwyl.io/lannvu/vue-firebase.svg)](http://hits.dwyl.io/lannvu/vue-firebase)
### Vertas News
A website to rate news articles and authors based on bias and accuracy.

### Motivation
Grew up in a vulnerable democracy, all three members of the VERTAS team understand and appreciate the freedom enjoyed here in the US, especially the freedom of speech. Seeing this sacred idea being abused by falsehoods and misinformation makes us believe that it is our duty to protect it, hence the idea for VERTAS.

VERTAS was created as platform for everyone to read and discuss news articles. In light of the Fake News Epidemic, we enable readers to read with confidence by allowing everyone to rate what they read for its level of TRUTH and BIAS demonstrated. We wholeheartedly believe that by democratizing information, we shall restore the public’s TRUST and DEPENDABILITY on the media.

### The Rating
We let the users rate the articles based on two criteria: accuracy and bias. All ratings are then converted into percentage scores for display.
* The green color represents the accuracy/truth rating.
* The red color represents right-wing bias.
* The blue color works the same way, but with left-wing bias.

### Features
* Registered users can give an article an accuracy rating and a bias rating. They will be calculated into users' score.
* Verified critics (journalists, influencers, etc) can rate as well. Their ratings will be calculated into critics' score.
* Users can view the aggregated ratings of authors and outlets. Ranking between outlets based on accuracy ratings is also shown.

### Preview
<img src="https://user-images.githubusercontent.com/32660699/75737840-5c4c3680-5cc6-11ea-9e0b-307d51bcbbba.png"/>
<img src="https://user-images.githubusercontent.com/32660699/75737844-5d7d6380-5cc6-11ea-8c5a-f1c7ae318341.png"/>
<img src="https://user-images.githubusercontent.com/32660699/75737849-5fdfbd80-5cc6-11ea-8e1d-be9ec5326e9e.png"/>
<img src="https://user-images.githubusercontent.com/32660699/75737877-6ff79d00-5cc6-11ea-8d4b-69180349c696.png"/>

## Tech/framework used

- [Vue.js](https://vuejs.org/)
- [Firebase](https://firebase.google.com/)
- [Google Cloud](https://cloud.google.com/)
- [Vuetify](https://vuetifyjs.com/en/)
- [Algolia](https://www.algolia.com/)
- [Materialize](https://materializecss.com/)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
