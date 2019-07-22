import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    Animated,
    TouchableOpacity,
    Image,
    Modal,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { Button, Icon, Fab, Container, FooterTab, Card, CardItem, Thumbnail, Left, Body, Right } from 'native-base';
import Geolocation from '@react-native-community/geolocation'
import { sendGeo } from '../Api/Services'
import User from '../Api/User'
import { db, firebaseapp } from '../Api/Config';
import { h, w, WIDTH, HEIGHT, totalSize } from '../Api/Dimesion'

const CARD_HEIGHT = HEIGHT / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

class Maps extends Component {

    constructor(props) {
        // console.disableYellowBox = true;
        super(props)
        this.state = {
            active: 'false',
            items: [''],
            longitude: 0,
            latitude: 0,
            myUid: '',
            error: '',
            data: [],
            modalVisible: false,
        }
        this.getLocation()

    }

    onPressChats = () => {
        this.setState({
            modalVisible: false
        })
        this.props.navigation.navigate('Chats', this.state.idF);
    }

    onPressProfileFriend = () => {
        this.setState({
            modalVisible: false
        })
        this.props.navigation.navigate('ProfileFriends', this.state.idF);
    }

    getLocation = async () => {
        await Geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    myUid: User.id,
                    error: null,
                });
                sendGeo(position.coords.latitude, position.coords.longitude, User.id)
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
        console.warn('get New Location')
    }

    componentWillMount() {
    
        setInterval(this.getLocation, 60000);
        this.index = 0;
        this.animation = new Animated.Value(0);
    }


    componentDidMount() {
        // setInterval(getLocation(), 20000)
        // console.ignoredYellowBox = true;

        db.ref('/user').on('value', (data) => {
            let values = data.val()
            if (values) {
                const listMessages = Object.keys(values).map(key => ({
                    ...values[key],
                    uid: key
                }));
                this.setState({
                    data: listMessages
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

    handleUser = () => {
        this.props.navigation.navigate('Profile');
    }

    setModalVisible(visible, value) {
        if (value == undefined) {
            this.setState({
                modalVisible: visible,
            })
            console.warn('modal gagal')
        } else {
            this.setState({
                modalVisible: visible,
                imgProfile2: value.imgProfile,
                username2: value.username,
                email2: value.email,
                story2: value.story,
                idF: value.uid
            })
        }

    }


    render() {
        console.warn('hasil', this.state.latitude, this.state.longitude, this.state.error)
        return (
            <View accessible={true} style={styles.container}>
                <MapView
                    ref={map => this.map = map}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.02864195044303443,
                        longitudeDelta: 0.020142817690068,
                    }}
                >

                    {this.state.data.map((item) => {
                        if (item.longitude != '') {
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
                {console.warn('render')}
                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: '#5067FF' }}
                    position="topRight"
                    onPress={this.handleUser}>
                    <Icon name="md-contact" />
                </Fab>
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
                            <Card>
                                <CardItem>
                                    <Left>
                                        <Thumbnail source={{ uri: this.state.imgProfile2 }} />
                                        <Body>
                                            <Text>{this.state.username2}</Text>
                                            <Text note>{this.state.story2}</Text>
                                        </Body>
                                    </Left>
                                </CardItem>
                                <CardItem>
                                    <Left>
                                        <Button transparent onPress={this.onPressProfileFriend}>
                                            <Icon active name="thumbs-up" />
                                            <Text style={{ fontSize: 20 }}>Profile</Text>
                                        </Button>
                                    </Left>
                                    <Body>
                                    </Body>
                                    <Right>
                                        <Button transparent onPress={this.onPressChats}>
                                            <Icon active name="chatbubbles" />
                                            <Text style={{ fontSize: 20 }}>Chat</Text>

                                        </Button>
                                    </Right>
                                </CardItem>
                            </Card>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Animated.ScrollView
                    horizontal
                    scrollEventThrottle={1}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CARD_WIDTH}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        x: this.animation,
                                    },
                                },
                            },
                        ],
                        { useNativeDriver: true }
                    )}
                    style={styles.scrollView}
                    contentContainerStyle={styles.endPadding}
                >
                    {this.state.data.map((marker, index) => {
                        if (marker.uid !== User.id) {
                            return (
                                <TouchableOpacity onPress={() => this.setModalVisible(true, marker)}>
                                    <View style={styles.card} key={index}>
                                        <Image
                                            source={{ uri: marker.imgProfile }}
                                            style={styles.cardImage}
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

        );
    }
}
export default Maps;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    scrollView: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    endPadding: {
        paddingRight: WIDTH - CARD_WIDTH,
    },
    card: {
        padding: 10,
        elevation: 2,
        backgroundColor: "#FFF",
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT - 10,
        width: CARD_WIDTH,
        overflow: "hidden",
    },
    cardImage: {
        flex: 3,
        width: "70%",
        height: "70%",
        alignSelf: "center",
    },
    textContent: {
        flex: 1,
    },
    cardtitle: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 12,
        color: "#444",
    },
    fabRight: {
        position: 'absolute',
        width: 58,
        height: 57,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        right: 10,
        bottom: 20,
        backgroundColor: '#FFFCFC',
        borderRadius: 50,
        elevation: 3
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    marker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(130,4,150, 0.9)",
    },
    ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(130,4,150, 0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(130,4,150, 0.5)",
    },
});