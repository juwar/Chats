import React, { Component } from 'react'
import firebase from 'firebase'
import { GiftedChat } from 'react-native-gifted-chat'
import user from '../Api/User'


export default class DetailChat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uid: this.props.navigation.state.params,
            text: '',
            messagesList: [],
        }
    }
    async componentWillMount() {
        await firebase.database().ref('messages').child(user.id).child(this.state.uid)
            .on('child_added', (value) => {
                this.setState((previousState) => {
                    return {
                        messagesList: GiftedChat.append(previousState.messagesList, value.val()),
                    }
                })
            })
    }
    sendMessage = async () => {
        if (this.state.text.length > 0) {
            let msgId = firebase.database().ref('messages').child(user.id).child(this.state.uid).push().key;
            let updates = {};
            let message = {
                _id: msgId,
                text: this.state.text,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                user: {
                    _id: user.id
                }
            }
            updates['messages/' + user.id + '/' + this.state.uid + '/' + msgId] = message;
            updates['messages/' + this.state.uid + '/' + user.id + '/' + msgId] = message;
            firebase.database().ref().update(updates)
            this.setState({ text: '' })

        }


    }
    render() {
        return (
            <GiftedChat
                text={this.state.text}
                messages={this.state.messagesList}
                onSend={this.sendMessage}
                user={{
                    _id: user.id
                }}
                onInputTextChanged={(value) => this.setState({ text: value })}
            />
        )
    }
}