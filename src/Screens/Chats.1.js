// @flow
import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0

import Fire from '../Api/Fire';

type Props = {
	name?: string,
};

class Chat extends React.Component<Props> {
	componentDidMount() {
		Fire.shared.on(message =>
			this.setState(previousState => ({
				messages: GiftedChat.append(previousState.messages, message),
			}))
		);
	}

	static navigationOptions = ({ navigation }) => ({
		title: navigation.getParam('name')
	});

	state = {
		messages: [],
	};

	get user() {
		return {
			idTo: this.props.navigation.getParam('idTo'),
			name: this.props.navigation.getParam('name'),
			// _id: this.props.navigation.getParam('name'),
		};
	}

	render() {
		return (
			<GiftedChat
				messages={this.state.messages}
				onSend={Fire.shared.send}
				user={this.user}
			/>
		);
	}

	componentWillUnmount() {
		Fire.shared.off();
	}
}

export default Chat;
