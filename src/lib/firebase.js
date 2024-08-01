import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDU-EdFcijDTvgILu5y7Ob9YhuNBdPouK8",
  authDomain: "ichat-5f006.firebaseapp.com",
  projectId: "ichat-5f006",
  storageBucket: "ichat-5f006.appspot.com",
  messagingSenderId: "825760391658",
  appId: "1:825760391658:web:973e772ea5047646891293"
};

const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore();
export const storage=getStorage();
