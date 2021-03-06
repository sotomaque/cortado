import React from 'react';
import { StyleSheet, TextInput, Text, View, Image, Keyboard, StatusBar }	from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Item, Input, Label, Form, Content } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

import { Button, Panel, NavigationBar } from '../../components'
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
      errors: [],
      loading: false,
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

    this.setState({loading: true});
    HttpClientHelper.get('forgot_password', {email: this.state.email}, (error, data) => {
      this.setState({loading: true});
      if (!error) {
        Actions.pop();
      } else {
        setTimeout(() => {
          Functions.showAlert('', `User with email ${this.state.email} does not exist.`);
        }, 100);
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
        <StatusBar barStyle="light-content"/>
        <View style={{
          backgroundColor: '#4B2D8F',
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          height: 300
        }}></View>
        <Content style={{padding: 20, backgroundColor:'transparent'}} ref='container'>
          <Text style={styles.heading}>Reset Your Password</Text>
          <Text style={styles.subHeading}>You'll receive an email with a link to reset your password.</Text>
          <Panel>
            <Form>
              <Item floatingLabel style={StyleSheet.flatten(styles.input)}>
                <Label style={StyleSheet.flatten(styles.inputLabel)}>Email</Label>
                <Input
                  onChangeText={(val) => this.setState({email: val})}
                  value={this.state.email}
                  keyboardType="email-address"
                  returnKeyType="go"
                  autoCapitalize="none"
                  style={StyleSheet.flatten(styles.inputField)}
                />
              </Item>
            </Form>
            <Button
              containerStyle={styles.button}
              textStyle={styles.buttonText}
              text="Send Password Reset Link"
              onPress={()=>this.handlePressForgotPassword()} />
          </Panel>
        </Content>
        {!this.state.keyboardShow&&<Button
          containerStyle={styles.cancelButton}
          textStyle={styles.cancelButtonText}
          text="Go Back"
          onPress={()=>this.handlePressCancel()} />}
        <Spinner visible={this.state.loading} />
      </View>
    )
  }
}
