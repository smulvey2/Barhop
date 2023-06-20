import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

//import firebaseui from "firebaseui";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDx7NzLBgmYMd0Us8TtL3w5Pdi5hKY-nLw",
  authDomain: "crawlr-2b677.firebaseapp.com",
  projectId: "crawlr-2b677",
  storageBucket: "crawlr-2b677.appspot.com",
  messagingSenderId: "732169641522",
  appId: "1:732169641522:web:81b15f128046d4dd03262b",
  measurementId: "G-TVK72YLHNJ"
};
const firebaseApp = initializeApp(firebaseConfig)

// Initialize Firebase
// let app;
// if (firebase.app.length === 0) {
//     app = firebase.initializeApp(firebaseConfig)
// }
// else {
//     app = firebase.app()
//}

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp);

//const ui = new firebaseui.auth.AuthUI(window.firebase.auth())

// This adds firebaseui to the page
// It does everything else on its own

export {db, auth}