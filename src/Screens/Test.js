/////////////===========MAPS===MAPS===MAPS==============//////////////
import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions, Image, Modal, AsyncStorage } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation';
// import Icon from 'react-native-vector-icons/AntDesign';
import firebase from 'firebase';
import user from '../User';
import { Button, Footer, FooterTab, Text, Icon } from 'native-base';

const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default class maps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            longitude: '',
            latitude: '',
            data: [],
            modalVisible: false
        },
            this.getLocation()
    }

    getLocation = async () => {
        await Geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
    }

    updateLocation = async () => {
        if (this.state.latitude) {
            await firebase.database().ref('users/' + user.uid).update({
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                status: 'online'
            })
        }
    }

    setModalVisible(visible, value) {
        if (value == undefined) {
            this.setState({
                modalVisible: visible,
            })
        } else {
            this.setState({
                modalVisible: visible,
                nama: value.username,
                email: value.email,
                status: value.status,
                id: value.uid,
                profile: value.profile,
            })
        }

    }

    async componentWillMount() {
        this.index = 0;
        this.animation = new Animated.Value(0);
        this.setState({
            myuid: await AsyncStorage.getItem('uid'),

        })
    }

    componentDidMount() {
        firebase.database().ref('users').on('value', (data) => {
            let values = data.val()
            if (values) {
                const messageList = Object.keys(values).map(key => ({
                    ...values[key],
                    uid: key
                }));
                this.setState({
                    data: messageList
                })
            }
        })

        this.animation.addListener(({ value }) => {
            let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
            if (index >= this.state.data.length) {
                index = this.state.data.length - 1;
            }
            if (index <= 0) {
                index = 0;
            }

            clearTimeout(this.regionTimeout);
            this.regionTimeout = setTimeout(() => {
                if (this.index !== index) {
                    this.index = index;
                    const coordinate = this.state.data[index];
                    this.map.animateToRegion(
                        {
                            latitude: coordinate.latitude,
                            longitude: coordinate.longitude,
                            latitudeDelta: 0.02864195044303443,
                            longitudeDelta: 0.020142817690068,
                        },
                        350
                    );
                }
            }, 10);
        });
    }

    exit = async () => {
        await AsyncStorage.removeItem('id_user');
        this.props.navigation.navigate('SignIn')
    }

    movePage = () => {
        this.setState({
            modalVisible: false
        })
        this.props.navigation.navigate('chat', this.state.id)
    }

    handleListChat = () => {
        this.props.navigation.navigate('ListChat')
    }
    handleListProfile = () => {
        this.props.navig
        ation.navigate('Profile')
    }

    render() {
        if (this.state.latitude && this.state.longitude) {
            this.updateLocation()
            return (

                <View style={styles.container}>
                    <View style={styles.container}>
                        <MapView
                            ref={map => this.map = map}
                            style={styles.map}
                            region={{
                                "latitude": this.state.latitude,
                                "longitude": this.state.longitude,
                                latitudeDelta: 0.02864195044303443,
                                longitudeDelta: 0.020142817690068,
                            }}
                        >
                            {this.state.data.map((item) => {
                                if (item.longitude == '' || item.uid == user.id) {

                                } else {
                                    return (
                                        <Marker
                                            coordinate={{
                                                latitude: item.latitude,
                                                longitude: item.longitude,
                                            }}
                                            title={item.username}
                                            description="in here"
                                        />
                                    )
                                }
                            })}

                        </MapView>

                        <Footer style={{ backgroundColor: '#347ed9' }}>
                            <FooterTab style={{ backgroundColor: '#347ed9' }}>
                                <Button vertical active style={{ backgroundColor: '#2d6ebd' }}>
                                    <Icon name="navigate" />
                                    <Text>Maps</Text>
                                </Button>
                                <Button vertical onPress={this.handleListChat}>
                                    <Icon name="chatbubbles" />
                                    <Text>Chat</Text>
                                </Button>
                                <Button vertical onPress={this.handleListProfile}>
                                    <Icon active name="person" />
                                    <Text>Profile</Text>
                                </Button>
                            </FooterTab>
                        </Footer>


                        {/* Modal when card on click */}
                        <View>
                            <Modal
                                transparent={true}
                                animationType="fade"
                                visible={this.state.modalVisible}
                                onPress={() => this.setModalVisible(false)}
                            >
                                <View style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(51,51,51,0.5)',
                                }}>
                                    <TouchableOpacity onPress={() => this.setModalVisible(false)}
                                        style={styles.modelstyle}
                                    >
                                        <View style={styles.imageModal}>
                                            <View style={{ flex: 2 }}>
                                                <Image
                                                    source={{ uri: (this.state.profile) }}
                                                    style={styles.images}
                                                />
                                                <Text style={styles.textModal}>{this.state.status}</Text>
                                                <Text style={{ fontSize: 15, textAlign: 'center' }}>{this.state.nama}</Text>
                                                <View style={{ flexDirection: 'row', width: '100%', paddingLeft: 20, paddingRight: 20 }}>
                                                    <Button success style={{ flex: 1, marginRight: 5 }} onPress={this.movePage}>
                                                        <T
                                                            ext style={{ textAlign: 'center', width: '100%' }}>Chat</Text>
                                                    </Button>
                                                    <Button warning style={{ flex: 1, marginLeft: 5 }}>
                                                        <Text style={{ textAlign: 'center', width: '100%' }}>Profile</Text>
                                                    </Button>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        </View>
                        <Animated.ScrollView
                            horizontal
                            scrollEventThrottle={1}
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={CARD_WIDTH}
                            onScroll={Animated.event(
                                [{
                                    nativeEvent: {
                                        contentOffset: {
                                            x: this.animation,
                                        },
                                    },
                                },],
                                { useNativeDriver: true }
                            )}
                            style={styles.scrollView}
                            contentContainerStyle={styles.endPadding}
                        >
                            {this.state.data.map((marker, index) => {
                                if (marker.uid !== user.id) {
                                    return (
                                        <TouchableOpacity onPress={() => this.setModalVisible(true, marker)}>
                                            <View style={styles.card} key={index}>
                                                <Image
                                                    source={{ uri: (marker.profile) }}
                                                    style={styles.cardImage}
                                                    resizeMode="cover"
                                                />
                                                <View style={styles.textContent}>
                                                    <Text numberOfLines={1} style={styles.cardtitle}>{marker.username}</Text>
                                                    <Text numberOfLines={1} style={styles.cardDescription}>
                                                        {marker.email}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }
                            })}
                        </Animated.ScrollView>
                    </View>
                </View>

            )
        }
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <MapView
                        style={styles.map}
                        region={{
                            "latitude": -7.7613167,
                            "longitude": 110.3589596,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                        }}>
                    </MapView>
                </View>
            </View>
        )
    }
}


/////////////===========REGISTER===REGISTER===REGISTER==============//////////////




import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Form, Item, Input, Label, Button, Text, Thumbnail } from 'native-base';
import Fire from '../../../Fire'
import firebase from 'firebase';


export default class Login extends Component {

    state = {
        email: '',
        username: '',
        phone: '',
        password: '',
        profile: '',
        errorMessage: null
    }

    handleNavigate = () => {
        const { navigation } = this.props;
        navigation.navigate('Login')
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    submitForm = async () => {
        let username = this.state.username;
        let email = this.state.email;
        let password = this.state.password;
        let profile = this.state.profile;
        await firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(this.successRegistration, this.errorRegistration)

    }

    errorRegistration = (error) => {
        Alert.alert('Error', error.message)
    }

    successRegistration = (data) => {
        firebase.database().ref('users/' + data.user.uid).set({
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            profile: this.state.profile,
        });
        Alert.alert('Success', "User was created successfully.")
        this.props.navigation.navigate('Login')
    }


    render() {
        return (
            <Container style={styles.container}>
                <Content >
                    <View style={{ flex: 1, alignItems: "center", paddingTop: 40 }}>
                        <Image source={require('../../assets/chat.png')} style={styles.image} />
                    </View>
                    <View style={{ flex: 1, alignItems: "center", paddingTop: 40 }}>
                        <Text style={{ fontSize: 30, fontWeight: "bold" }}>Form Registration</Text>
                    </View>
                    {this.state.errorMessage &&
                        <Text style={{ color: 'red' }}>
                            {this.state.errorMessage}
                        </Text>}
                    <Form style={{ marginTop: 18 }}>
                        <Item>
                            <Input
                                placeholder="Image URL"
                                value={this.state.profile}
                                onChangeText={this.handleChange('profile')}
                            />
                        </Item>
                        <Item>
                            <Input
                                placeholder="Email"
                                value={this.state.email}
                                onChangeText={this.handleChange('email')}
                            />
                        </Item>
                        <Item>
                            <Input
                                placeholder="Username"
                                value={this.state.username}
                                onChangeText={this.handleChange('username')}
                            />
                        </Item>
                        <Item>
                            <Input
                                placeholder="Password"
                                secureTextEntry={true}
                                value={this.state.password}
                                onChangeText={this.handleChange('password')}
                            />
                        </Item>

                        <View style={styles.button}>
                            <Button block onPress={this.submitForm} style={{ backgroundColor: '#347ed9' }}>
                                <Text>registration</Text>
                            </Button>
                        </View>
                    </Form>
                    <View style={styles.registration}>
                        <Text style={{ textAlign: "center" }}>
                            Already have an account?
                        </Text>
                        <TouchableOpacity onPress={this.handleNavigate}>
                            <Text style={{ fontWeight: "bold" }}> Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </Content>
            </Container>
        );
    }
}




/////////////===========LOGIN===LOGIN===LOGIN==============//////////////
import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { Container, Content, Form, Item, Input, Fab, Button, Text, Icon, Thumbnail } from 'native-base';
import Fire from '../../../Fire'
import firebase from 'firebase';
import User from '../User'



export default class Login extends Component {

    state = { uid: '', email: '', password: '' }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    submitForm = async () => {
        await firebase.auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(this.successLogin, this.errorLogin)
            .catch(function (error) {
                Alert.alert('Error', error.message)
            })

    }

    errorLogin = (error) => {
        Alert.alert('Error', error.message)
    }

    successLogin = (data) => {
        console.warn('login')
        console.warn(data.user.uid)
        let uid = data.user.uid
        AsyncStorage.setItem('uid', uid)
        User.uid = uid 
        this.props.navigation.navigate('Map')
    }




    render() {
        return (
            <Container style={styles.container}>
                <Content >
                    <View style={{ flex: 1, alignItems: "center", paddingTop: 40 }}>
                        <Image source={require('../../assets/chat.png')} style={styles.image} />
                    </View>
                    <Form style={{ marginTop: 50 }}>
                        <Item>
                            <Input
                                placeholder="Email"
                                value={this.state.email}
                                onChangeText={this.handleChange('email')}
                            />
                        </Item>
                        <Item>
                            <Input
                                placeholder="Password"
                                secureTextEntry={true}
                                value={this.state.password}
                                onChangeText={this.handleChange('password')}
                            />
                        </Item>
                        <View style={styles.button}>
                            <Button block onPress={this.submitForm} style={{ backgroundColor: '#347ed9' }}>
                                <Text>Login</Text>
                            </Button>
                        </View>
                    </Form>
                    <View style={styles.registration}>
                        <Text style={{ textAlign: "center" }}>
                            Don't have an account yet?
            </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Registration')}>
                            <Text style={{ fontWeight: "bold" }}> Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </Content>
            </Container>
        );
    }
}


// <Image source={require('../../assets/live_chat.png')} style={styles.image} />
