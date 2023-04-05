import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAVlEpm9HGUhnMknIiYRoDR98ZRLH-waLI",
    authDomain: "clone-34ab8.firebaseapp.com",
    projectId: "clone-34ab8",
    storageBucket: "clone-34ab8.appspot.com",
    messagingSenderId: "119157226051",
    appId: "1:119157226051:web:b5d3380b8e1f1b10b972f6"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default db