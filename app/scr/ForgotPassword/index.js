import React from 'react';
import { StyleSheet, TextInput, Text, View, Image, Keyboard }	from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';

import { Button } from '../../components'
import { Metrics, Images, Colors } from '../../themes';
import { HttpClientHelper } from '../../libs';
import styles from './styles'
import * as Functions from '../../utils/Functions';
import * as EmailValidator from 'email-validator';
import { NavigationBar } from '../../components';

export default class ForgotPassword extends React.Component {

  constructor() {
    super();
    this.state = {
      email: '',
      errors: [],
      keyboardShow: false
    }
    this._keyboardDidShow = this._keyboardDidShow.bind(this)
		this._keyboardDidHide = this._keyboardDidHide.bind(this)
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

  _keyboardDidShow () {
		this.setState({keyboardShow: true})
	}

	_keyboardDidHide () {
		this.setState({keyboardShow: false})
	}

	componentWillMount () {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	}

	componentWillUnmount () {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
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
        {!this.state.keyboardShow&&<Button
          containerStyle={styles.cancelButton}
          textStyle={styles.cancelButtonText}
          text="Cancel"
          onPress={()=>this.handlePressCancel()} />}
      </View>
    )
  }
}
