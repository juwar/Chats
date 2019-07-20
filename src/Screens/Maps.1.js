import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { Button, Icon, Fab, Container, FooterTab } from 'native-base';
import Geolocation from '@react-native-community/geolocation'
import { sendGeo} from '../Api/Services'
import User from '../Api/User'
import { db, firebaseapp } from '../Api/Config';
import { h, w, WIDTH, HEIGHT, totalSize } from '../Api/Dimesion'

class Maps extends Component {

    constructor(props) {
        super(props)
        this.state = {
            active: 'false',
            items: [''],
            longitude: 0,
            latitude: 0,
            myUid: '',
            error: '',
            data: [],
        }
        this.getLocation()
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
        console.warn(User.id)
    }

    componentDidMount() {
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
    }

    handleUser = () => {
        this.props.navigation.navigate('Profile');
    }


    render() {
        console.warn('hasil', this.state.latitude, this.state.longitude, this.state.error)
        return (
            <View accessible={true} style={styles.container}>
                <MapView
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
                    position="topLeft"
                    onPress={this.handleUser}>
                    <Icon name="user" />
                </Fab>
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
});