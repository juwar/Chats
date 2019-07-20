
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import User from '../Api/User'
import { db, firebaseapp } from '../Api/Config';
import user from '../Api/User';

export default class UserProfileView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            story: '',
            imgProfile: '',
            email: '',
            dataProfile: [],
        }
    }

    componentDidMount() {
        const setData = async () => {
            await db.ref('/user/' + User.id).on('value', (data) => {
                let values = data.val()
                this.setState({
                    username: values.username,
                    story: values.story,
                    imgProfile: values.imgProfile,
                    email: values.email,
                })
                console.warn('data', this.state.dataProfile)
                console.warn(data.Val)
            })
        }
        setData()
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Image style={styles.avatar}
                            source={{ uri: this.state.imgProfile }} />
                        <Text style={styles.name}>{this.state.username}</Text>
                        <Text style={styles.userInfo}>{this.state.email}</Text>
                        <Text style={styles.userInfo}>{this.state.story}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#DCDCDC",
    },
    headerContent: {
        padding: 30,
        alignItems: 'center',
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        color: "#000000",
        fontWeight: '600',
    },
    userInfo: {
        fontSize: 16,
        color: "#778899",
        fontWeight: '600',
    },
    body: {
        backgroundColor: "#778899",
        height: 500,
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
    },
    infoContent: {
        flex: 1,
        alignItems: 'flex-start',
        paddingLeft: 5
    },
    iconContent: {
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: 5,
    },
    icon: {
        width: 30,
        height: 30,
        marginTop: 20,
    },
    info: {
        fontSize: 18,
        marginTop: 20,
        color: "#FFFFFF",
    }
});
