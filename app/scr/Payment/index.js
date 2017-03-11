import React from 'react';
import { View, ScrollView, Text, Image, TextInput, NetInfo, StyleSheet } from 'react-native';
import { Images } from '../Themes';
import { CreditCardInput } from 'react-native-credit-card-input';

const s = StyleSheet.create({
  container: {
    marginTop: 60,
  },
  label: {
    color: "black",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
});

const USE_LITE_CREDIT_CARD_INPUT = false;

class Payment extends React.Component {

  _onChange = formData => {
    /* eslint no-console: 0 */
    console.log(JSON.stringify(formData, null, " "));
  };

  _onFocus = field => {
    /* eslint no-console: 0 */
    console.log(field);
  };

  constructor (props: Object) {
    super(props)
    this.state = { text: 'Placeholder Credit Card Numbers' };
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <View style={s.container}>
          <CreditCardInput
              autoFocus
              requiresName
              requiresCVC
              labelStyle={s.label}
              inputStyle={s.input}
              validColor={"white"}
              invalidColor={"red"}
              placeholderColor={"white"}
              onFocus={this._onFocus}
              onChange={this._onChange} />
        </View>
      </View>
    )
  }
}

module.exports = Payment;
