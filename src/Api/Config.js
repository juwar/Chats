import firebase from 'firebase';
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "YOUR_APIKEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        databaseURL: "YOUR_DATABASE",
        projectId: "YOUR_PROJECT",
        storageBucket: "",
        messagingSenderId: "YOR_SENDER_ID",
        appId: "APP_ID"
    });
}
export const firebaseapp = firebase
export const db = firebase.database();