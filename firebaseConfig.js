// firebaseConfig.js (✅ Web SDK version - correct for Expo/EAS)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCHBy4Kn_2grKrXriqYDsPhsoepnHv04_Y',
  authDomain: 'genesis-3f594.firebaseapp.com',
  projectId: 'genesis-3f594',
  storageBucket: 'genesis-3f594.appspot.com',
  appId: '1:641263152953:web:3c11dd773c4dfcd30382e8',
  measurementId: 'G-HEXF9WRBWF',
  databaseURL: 'https://genesis-3f594-default-rtdb.firebaseio.com/'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { app, auth, db, rtdb };
