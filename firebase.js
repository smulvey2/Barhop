import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
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
firebase.initializeApp(firebaseConfig)
// Initialize Firebase
let app;
if (firebase.app.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
}
else {
    app = firebase.app()
}

const db = app.firestore()
const auth = firebase.auth()
export {db, auth}