import { db, firebaseapp } from '../Api/Config';

let imgProfile = 'https://cdn.shopify.com/s/files/1/0099/9562/files/Header-Icon-User.png?14597416339728210630'
let story = "Hello i'm using Friend Zone"
let status = 'offline'

export const register = async (username, email, password) => {

    successRegistration = (data) => {
        db.ref('user/' + data.user.uid).set({
            username: username,
            email: email,
            imgProfile: imgProfile,
            story: story,
            latitude: 0,
            longitude: 0,
            status: status
        });
    }

    try {
        await firebaseapp.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(this.successRegistration)
        alert('successful registration please return to login')
    } catch (error) {
        alert(error.toString(error));
        return
    }

}


export const sendGeo = async (latitude, longitude, uid) => {
    await db.ref('user/' + uid).update({
        latitude: latitude,
        longitude: longitude,
    });
}

export const updateUser = async (imgProfile, uid) => {
    await db.ref('user/' + uid).update({
        imgProfile: '',
    });
}