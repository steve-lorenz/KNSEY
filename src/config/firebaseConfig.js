/* eslint-disable no-undef */
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: 'knsey-bce8e.firebaseapp.com',
  databaseURL: 'https://knsey-bce8e.firebaseio.com',
  projectId: 'knsey-bce8e',
  storageBucket: 'knsey-bce8e.appspot.com',
  messagingSenderId: '923274980719',
};

firebase.initializeApp(config);
// firebase.firestore().settings({ timestampsInSnapshots: true })

export default firebase;
