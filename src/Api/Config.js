import firebase from 'firebase';
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyB3q17F8tBExoDw8mgf48rIuLadvfV7KLc",
        authDomain: "simplechatwithmaps.firebaseapp.com",
        databaseURL: "https://simplechatwithmaps.firebaseio.com",
        projectId: "simplechatwithmaps",
        storageBucket: "",
        messagingSenderId: "926693418671",
        appId: "1:926693418671:web:af9970ae6e7c1ff7"
    });
}
export const firebaseapp = firebase
export const db = firebase.database();