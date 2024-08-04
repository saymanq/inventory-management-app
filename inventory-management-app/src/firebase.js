// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHY0J0eCgBWTpkAm0c5cgYCgcz871Hm60",
  authDomain: "inventory-management-app-df1fa.firebaseapp.com",
  projectId: "inventory-management-app-df1fa",
  storageBucket: "inventory-management-app-df1fa.appspot.com",
  messagingSenderId: "63324901491",
  appId: "1:63324901491:web:89c92d55205da8e5d1da06",
  measurementId: "G-GLCKYGKYQ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { firestore, auth };