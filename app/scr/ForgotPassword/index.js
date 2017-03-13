import React from 'react';
import { StyleSheet, TextInput, Text, View, Image }	from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';

import { Button } from '../../components'
import { Metrics, Images, Colors } from '../../themes';
import { HttpClientHelper } from '../../libs';
import styles from './styles'
import * as Functions from '../../utils/Functions';
import * as EmailValidator from 'email-validator';

export default class ForgotPassword extends React.Component {

  constructor() {
    super();

    this.state = {
      email: '',
      errors: []
    }
  }

  handlePressCancel = () => {
    Actions.pop();
  }

  async handlePressForgotPassword() {
    if(!Functions.validateForm('Email', this.state.email))
      return;

    if(this.state.email.indexOf("@")<0) {
      Functions.showAlert('', 'An email address must contain a single @');
      return;
    }

    let isEmailValid = await EmailValidator.validate(this.state.email);
    if(!isEmailValid) {
      Functions.showAlert('', 'Please enter a valid email');
      return;
    }

    HttpClientHelper.get('forgot_password', {email: this.state.email}, (error, data)=>{
      if(!error) {
        Actions.pop();
      } else {
        Functions.showAlert('', `User with email ${this.state.email} does not exist.`)
      }
    })
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.loginBackground} style={styles.backgroundImage} resizeMode='stretch' />
        <View style={styles.container} ref='container'>
          <Text style={styles.heading}>RESET PASSWORD</Text>
          <TextInput
            onChangeText={(val) => this.setState({email: val})}
            style={styles.input} placeholder='Email'
            returnKeyType='go'
            autoCapitalize='none' />
          <Button
            containerStyle={styles.button}
            textStyle={styles.buttonText}
            text="SEND PASSWORD RESET EMAIL"
            onPress={()=>this.handlePressForgotPassword()} />
        </View>
        <Button
          containerStyle={styles.cancelButton}
          textStyle={styles.cancelButtonText}
          text="Cancel"
          onPress={()=>this.handlePressCancel()} />
      </View>
    )
  }
}
