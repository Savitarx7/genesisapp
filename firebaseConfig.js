// firebaseConfig.js (Expo SDK 53 + EAS) using React Native Firebase
import { firebase } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

// Firebase credentials should not be hard-coded for production use. Environment
// variables prefixed with EXPO_PUBLIC_ allow access in EAS and during local
// development. The existing values are kept as fallbacks.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
    'AIzaSyCHBy4Kn_2grKrXriqYDsPhsoepnHv04_Y',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    'genesis-3f594.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'genesis-3f594',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'genesis-3f594.appspot.com',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
    '1:641263152953:web:3c11dd773c4dfcd30382e8',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    'G-HEXF9WRBWF',
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL ||
    'https://genesis-3f594-default-rtdb.firebaseio.com/'
};

let app;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const authInstance = auth();
const db = firestore();
const rtdb = database();
export { app, authInstance as auth, db, rtdb };
