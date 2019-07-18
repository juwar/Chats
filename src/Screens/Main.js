import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from "react-native";

class Main extends Component {

    static navigationOptions = {
        title: 'Chatter',
    };

    state = {
        name: '',
    };

    onPressChats = () =>
        this.props.navigation.navigate('Chats', { name: this.state.name });

    onPressMaps = () =>
        this.props.navigation.navigate('Maps', { name: this.state.name });

    onChangeText = name => this.setState({ name });

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 2, flexDirection: 'row' }}>
                    <Text style={styles.title}>Enter your name :</Text>
                </View>
                <View style={{ flex: 2, flexDirection: 'row' }}>
                    <TextInput
                        style={styles.nameInput}
                        placeholder='Username'
                        onChangeText={this.onChangeText}
                        value={this.state.name}
                    />
                </View>
                <View style={{ flex: 6, flexDirection: 'row' }}>
                    <TouchableOpacity onPress={this.onPressChats}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onPressMaps}>
                        <Text style={styles.buttonText}>Maps</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
export default Main

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    title: {
        margin: 10,
        fontSize: 20,
    },
    nameInput: {
        margin: 10,
        borderColor: '#111111',
        borderWidth: 1,
    }
});