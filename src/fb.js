import firebase from 'firebase/app';
import 'firebase/firestore';

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyCxnqBzFpFq4ZeOgAzOiets5_BavghdbgM',
  authDomain: 'vertasbackend.firebaseapp.com',
  databaseURL: 'https://vertasbackend.firebaseio.com',
  projectId: 'vertasbackend',
  storageBucket: 'vertasbackend.appspot.com',
  messagingSenderId: '471580286074'
};
firebase.initializeApp(config);
const db = firebase.firestore();

export default db;
