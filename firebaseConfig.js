import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyCHBy4Kn_2grKrXriqYDsPhsoepnHv04_Y",
    authDomain: "genesis-3f594.firebaseapp.com",
    projectId: "genesis-3f594",
    storageBucket: "genesis-3f594.appspot.com",
    messagingSenderId: "641263152953",
    appId: "1:641263152953:web:3c11dd773c4dfcd30382e8",
    measurementId: "G-HEXF9WRBWF",
    databaseURL: "https://genesis-3f594-default-rtdb.firebaseio.com/" // ✅ Add Realtime Database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app); // ✅ Initialize Realtime Database

// Initialize Auth with AsyncStorage persistence
let auth;
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
} catch (error) {
    auth = getAuth(app); // Fallback in case `initializeAuth` causes issues
}

export { db, rtdb, auth }; // ✅ Export rtdb for Realtime Database