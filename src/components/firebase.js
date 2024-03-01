import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDEyRmbYvy3crH9EqktznUxwU3InGV7tl4",
    authDomain: "login-app-fff4e.firebaseapp.com",
    projectId: "login-app-fff4e",
    storageBucket: "login-app-fff4e.appspot.com",
    messagingSenderId: "95115024140",
    appId: "1:95115024140:web:cf9361148ebfd25e029b29",
    measurementId: "G-XQLFMT0D1H",
    databaseURL: "https://login-app-fff4e-default-rtdb.firebaseio.com",
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  export const db = firebase.firestore();
  export default auth;