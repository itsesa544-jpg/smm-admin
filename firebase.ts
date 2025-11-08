import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX38y3HlAUMZZ3b6aJGrk7mZOvgBtkHH4",
  authDomain: "smmpanel-f614e.firebaseapp.com",
  projectId: "smmpanel-f614e",
  storageBucket: "smmpanel-f614e.appspot.com",
  messagingSenderId: "213883233645",
  appId: "1:213883233645:web:a6ebefd96f2a2baaf26664"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { db, auth };
