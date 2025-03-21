// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's FirebaseConfig configuration
// For FirebaseConfig JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCS2eZ5oaD9bVotOMw7sBN_tIjuz_5VYJ4",
    authDomain: "marina-management-pab.firebaseapp.com",
    databaseURL: "https://marina-management-pab-default-rtdb.firebaseio.com",
    projectId: "marina-management-pab",
    storageBucket: "marina-management-pab.firebasestorage.app",
    messagingSenderId: "413343468849",
    appId: "1:413343468849:web:3f512a47aabf75103ff410",
    measurementId: "G-HPV23N7MTD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {db, auth}
