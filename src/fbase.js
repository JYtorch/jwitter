import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVVnE6nk29LBh_8_-l2u2NVK5BX_99JC0",
  authDomain: "jwitter-a7398.firebaseapp.com",
  projectId: "jwitter-a7398",
  storageBucket: "jwitter-a7398.appspot.com",
  messagingSenderId: "653872478648",
  appId: "1:653872478648:web:89350e0148a1b9ac82774d"
};

export default firebase.initializeApp(firebaseConfig);
export const firebaseInstance = firebase;
export const authService = firebase.auth();
export const dbService = firebase.firestore();
export const storageService = firebase.storage();