import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

import { Dialogflow_V2 } from 'react-native-dialogflow';

import { dialogflowConfig } from './env';

const BOT_USER = {
  _id: 2,
  name: 'Tina',
  avatar: 'https://cdn3.vectorstock.com/i/1000x1000/99/62/chat-bot-icon-background-virtual-assistant-for-vector-24999962.jpg'
};

export default class App extends Component {
  state = {
    messages: [
      {

        _id: 1,
        text:`Hello there! My name is Tina. I am your virutal assistant to help you feel better!How are you today and how many I help you?\n\nI recommend asking 'what can you do?'`,
        createdAt: new Date(),
        user: BOT_USER
      }
    ]
  };


  componentDidMount() {
      Dialogflow_V2.setConfiguration(
        dialogflowConfig.client_email,
        dialogflowConfig.private_key,
        Dialogflow_V2.LANG_ENGLISH_US,
        dialogflowConfig.project_id
      );
    }

    handleGoogleResponse(result) {
      let text = result.queryResult.fulfillmentMessages[0].text.text[0];
      this.sendBotResponse(text);
    }

    onSend(messages = []) {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }));

      let message = messages[0].text;
      Dialogflow_V2.requestQuery(
        message,
        result => this.handleGoogleResponse(result),
        error => console.log(error)
      );
    }

    sendBotResponse(text) {
      let msg = {
        _id: this.state.messages.length + 1,
        text,
        createdAt: new Date(),
        user: BOT_USER
      };

      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, [msg])
      }));
    }

    render() {
      return (
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: 1
            }}
          />
        </View>
      );
  }
}