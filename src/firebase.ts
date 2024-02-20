import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCwfnJVsIqU84oaXxUR7x8h_IOrjkk9Pcc",
  authDomain: "user-profile-82a48.firebaseapp.com",
  projectId: "user-profile-82a48",
  storageBucket: "user-profile-82a48.appspot.com",
  messagingSenderId: "1000091451640",
  appId: "1:1000091451640:web:175ba6b984d288c97abb0d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
// export const db = getDatabase(app);
export const db = getFirestore(app);

export default app;