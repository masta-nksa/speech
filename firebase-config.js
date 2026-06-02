// Gemeinsame Firebase-Konfiguration für Login und Register
const firebaseConfig = {
    apiKey: "AIzaSyCr5yCghQhUo5NqhIdUqWaFsjxwRY-yW8c",
    authDomain: "translation-8d0ba.firebaseapp.com",
    projectId: "translation-8d0ba",
    storageBucket: "translation-8d0ba.firebasestorage.app",
    messagingSenderId: "708055365528",
    appId: "1:708055365528:web:7c0921856b7c4a79c51ded",
    measurementId: "G-YLKGM7YYYT"
};

// Firebase initialisieren (nur einmal)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();