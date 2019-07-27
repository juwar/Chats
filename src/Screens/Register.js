import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { h, w, WIDTH, HEIGHT, totalSize } from '../Api/Dimesion'
import { register, find } from '../Api/Services'

class Register extends Component {

    state = {
        username: '',
        email: '',
        password: '',
        repeate: '',
    }

    onPressRegister = () => {
        if (!this.state.username || !this.state.email || !this.state.password || !this.state.repeate) {
            alert('data cannot be empty!')
            return
        }
        if (this.state.password != this.state.repeate) {
            alert('password does not match!')
            return
        }
        register(this.state.username, this.state.email, this.state.password)
    }

    onPressLogin = () =>
        this.props.navigation.navigate('Login');

    render() {
        return (
            <SafeAreaView style={styles.background}>
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder={'Username'}
                        placeholderTextColor={'rgba(224,224,224,1.0)'}
                        underlineColorAndroid='transparent'
                        onChangeText={username => this.setState({ username })}
                    />
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
                        placeholder={'Password'}
                        secureTextEntry={true}
                        placeholderTextColor={'rgba(224,224,224,1.0)'}
                        underlineColorAndroid='transparent'
                        onChangeText={password => this.setState({ password })}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={'Repeate Password'}
                        secureTextEntry={true}
                        placeholderTextColor={'rgba(224,224,224,1.0)'}
                        underlineColorAndroid='transparent'
                        onChangeText={repeate => this.setState({ repeate })}
                    />
                </View>
                <View style={styles.buttonContainer2}>
                    <TouchableOpacity
                        onPress={this.onPressRegister}
                        style={styles.buttonRegister}
                        activeOpacity={0.6}
                    >
                        <Text style={styles.register}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={this.onPressLogin}
                        activeOpacity={0.6}
                    >
                        <Text style={styles.login}>{'<'} Login</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}
export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        backgroundColor: '#555555',
        flex: 1,
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
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,1.0)',
        fontSize: 16,
        paddingLeft: 45,
        backgroundColor: 'rgba(255,255,255,0.15)',
        color: 'rgba(255,255,255,1.0)',
        marginHorizontal: 25,
    },
    buttonContainer: {
        marginTop: 20,
    },
    buttonContainer2: {
        marginTop: 40,
        alignItems: 'center',
    },
    buttonLogin: {
        width: WIDTH - 55,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#888888',
        alignItems: 'center'
    },
    buttonRegister: {
        width: WIDTH - 55,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#888888',
        alignItems: 'center'
    },
    register: {
        color: 'rgba(255,255,255,1.0)',
        fontWeight: '700',
        paddingVertical: h(1),
        fontSize: 20,
    },
    login: {
        color: 'rgba(255,255,255,1.0)',
        fontWeight: '500',
        paddingVertical: h(1),
        fontSize: 18,
        alignSelf: 'flex-start',
        paddingLeft: 27.5,
    },
});