import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Image,
    TextInput,
    AsyncStorage,
} from "react-native";

import { db, firebaseapp } from '../Api/Config';
import { h, w, WIDTH, HEIGHT, totalSize } from '../Api/Dimesion'
import { login } from '../Api/Services'
import User from '../Api/User'

import bgImage from '../Assets/background.png'
import logo from '../Assets/companylogo.png'

console.log(WIDTH)

class Login extends Component {

    state = {
        email: '',
        password: ''
    }

    successLogin = async (data) => {
        let uid = data.user.uid
        await AsyncStorage.setItem('uid', uid)
        User.id = uid
        this.props.navigation.navigate('Maps');
    }

    onPressLogin = async () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (!this.state.email || !this.state.password) {
            alert("Email and Password can't be null")
            return
        }

        if (reg.test(this.state.email) === false) {
            alert('Email is not correct')
            return
        }

        try {
            await firebaseapp.auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(this.successLogin)
        } catch (error) {
            alert('Email and password is false');
        }
    }
    onPressRegister = () =>
        this.props.navigation.navigate('Register');

    render() {
        return (
            <ImageBackground source={bgImage} style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo}></Image>
                    {/* <Text style={styles.textlogo}>FRIEND ZONE</Text> */}
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={'Email'}
                        placeholderTextColor={'rgba(224,224,224,1.0)'}
                        underlineColorAndroid='transparent'
                        keyboardType='email-address'
                        onChangeText={email => this.setState({ email })}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={'Login'}
                        secureTextEntry={true}
                        placeholderTextColor={'rgba(224,224,224,1.0)'}
                        underlineColorAndroid='transparent'
                        onChangeText={password => this.setState({ password })}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={this.onPressLogin}
                        style={styles.buttonLogin}
                        activeOpacity={0.6}
                    >
                        <Text style={styles.login}>Login</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer2}>
                    <TouchableOpacity
                        onPress={this.onPressRegister}
                        style={styles.buttonRegister}
                        activeOpacity={0.6}
                    >
                        <Text style={styles.login}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }
}
export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center'
    },
    logo: {
        width: WIDTH - (WIDTH / 2),
        height: WIDTH - (WIDTH / 2),
    },
    textlogo: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
        marginTop: 10,
        opacity: 0.5
    },
    inputContainer: {
        marginTop: 20,
    },
    input: {
        width: WIDTH - 55,
        height: 45,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,1.0)',
        fontSize: 16,
        paddingLeft: 45,
        backgroundColor: 'rgba(255,255,255,0.25)',
        color: 'rgba(255,255,255,1.0)',
        marginHorizontal: 25,
    },
    buttonContainer: {
        marginTop: 40,
    },
    buttonContainer2: {
        marginTop: 20,
    },
    buttonLogin: {
        width: WIDTH - 55,
        height: 45,
        borderRadius: 25,
        // borderWidth:2,
        backgroundColor: 'rgba(0,128,255,1.0)',
        alignItems: 'center'
    },
    buttonRegister: {
        width: WIDTH - 55,
        height: 45,
        borderRadius: 25,
        // borderWidth:2,
        backgroundColor: 'rgba(153,51,255,1.0)',
        alignItems: 'center'
    },
    login: {
        color: 'rgba(255,255,255,1.0)',
        fontWeight: '700',
        paddingVertical: h(1),
        fontSize: 20,
    },
});