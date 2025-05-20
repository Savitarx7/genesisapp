// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCHBy4Kn_2grKrXriqYDsPhsoepnHv04_Y',
  authDomain: 'genesis-3f594.firebaseapp.com',
  projectId: 'genesis-3f594',
  storageBucket: 'genesis-3f594.appspot.com',
  messagingSenderId: '641263152953',
  appId: '1:641263152953:web:3c11dd773c4dfcd30382e8',
  measurementId: 'G-HEXF9WRBWF',
  databaseURL: 'https://genesis-3f594-default-rtdb.firebaseio.com/',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

export { app, auth, db, rtdb };
