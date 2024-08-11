// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCPkP_JPi91nQO5uTuQJJghr2J9m7aE60",
  authDomain: "inventory-managment-9774d.firebaseapp.com",
  projectId: "inventory-managment-9774d",
  storageBucket: "inventory-managment-9774d.appspot.com",
  messagingSenderId: "611957235815",
  appId: "1:611957235815:web:816de037cf4ca95fdeb4c2",
  measurementId: "G-CQXDJFWBZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}