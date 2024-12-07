import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAWzbSWohRizdXm1_aWV-AqeyCJLjijpIY",
    authDomain: "oii-leaderboard.firebaseapp.com",
    databaseURL: "https://oii-leaderboard-default-rtdb.europe-west1.firebasedatabase.app", 
    projectId: "oii-leaderboard",
    storageBucket: "oii-leaderboard.firebasestorage.app",
    messagingSenderId: "50958797668",
    appId: "1:50958797668:web:8a08503469366d10cb4871",
    measurementId: "G-5TE6211QMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export default db;
