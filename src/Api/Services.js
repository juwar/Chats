import { db, firebaseapp } from '../Api/Config';

let imgProfile = 'https://cdn.shopify.com/s/files/1/0099/9562/files/Header-Icon-User.png?14597416339728210630'
let status = "Hello i'm using Friend Zone"

export const register = async (username, email, password) => {

    try {
        await firebaseapp.auth().createUserWithEmailAndPassword(email, password)
        alert('successful registration please return to login')
    } catch (error) {
        alert(error.toString(error));
        return
    }
    
    db.ref('/user').push({
        username: username,
        email: email,
        imgProfile: imgProfile,
        status: status,
    });
}

// export const login = async (email, password) => {
//     console.warn('services',email, password)
//     try {
//         await firebaseapp.auth().signInWithEmailAndPassword(email, password)
//         // console.warn("success")
//     } catch (error) {
//         // console.warn(error.toString(error));
//         alert('Email and password is false');
//     }
//     return 'true'
// }

// export const find = () => {
//     db.ref('/user').on('value', function (snapshot) {
//         console.warn(snapshot.val())
//     });
// }

export const find = () => {
    db.ref('/user').on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            let childKey = childSnapshot.val().username;
            console.warn(childKey)
        });
    });
}