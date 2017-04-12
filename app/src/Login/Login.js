import React from 'react';
import { TextInput, Text, View, Image, Keyboard, StyleSheet, StatusBar } from 'react-native';
import { Form, Item, Input, Label, Icon, Content } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
var { FBLoginManager } = require('react-native-facebook-login');

import { Touchable, Button, Panel } from '../../components';
import { Metrics, Images, Colors } from '../../themes';
import { HttpClientHelper, SessionManager } from '../../libs';
import styles from './styles';
import * as DataParser from '../../utils/DataParser';
import * as Functions from '../../utils/Functions';
import Analytics from '../../utils/analytics';
import { User } from '../../beans';

export default class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: '',
      loading: false,
      keyboardShow: false,
    }
    this.onLoginPressed = this.onLoginPressed.bind(this);
    this.onLoginFBPressed = this.onLoginFBPressed.bind(this);
    this.handleLoginFB = this.handleLoginFB.bind(this);
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.handlePressSignUp = this.handlePressSignUp.bind(this);
    this.handlePressForgotPassword = this.handlePressForgotPassword.bind(this);
  }

  startAnimateButton() {
    this.setState({ loading: true });
    setTimeout(()=> {
        this.setState({
            offesetY: this.state.clickTop - this.state.top,
            offesetX: this.state.clickLeft - this.state.left
        });
    }, 0);
    Animated.timing(this.state.buttonWidth, {toValue: 50}).start();
    Animated.timing(this.state.opacity, { toValue: 1, duration: 10 }).start();
    Animated.timing(this.state.bounceValue, { toValue: 300, duration: 455, easing: Easing.in(Easing.quad) }).start();
    setTimeout(()=> {
        Animated.timing(this.state.opacity, {toValue: 0}).start();
    }, 280);
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

  handlePressSignUp() {
    this.setState({error: ''});
    Actions.register();
  }

  handlePressForgotPassword() {
    this.setState({error: ''});
    Actions.forgotPassword();
  }

  handleLoginFB() {
    this.setState({loading: true});
    HttpClientHelper.post('login_fb', DataParser.getLoginFBData(), (error, data) => {
      if (!error) {
        SessionManager.setToken(HttpClientHelper.genBasicAuth(User.email, data.token));
        this.handleLoggedIn();
      } else {
        this.setState({loading: false});
        //show error
        Functions.showAlert('', error.error ? error.error : "An unknown error has occurred. Please try again later.");
      }
    })
  }

  handleLoggedIn() {
    HttpClientHelper.get('world', null, (error, data) => {
      this.setState({loading: false});
      if (!error) {
        try {
          let user = data.user;
          if (user) {
            user.intercom_enabled = data.intercom_enabled;
            DataParser.initializeUser(user);
            Analytics.identifyUserByEmail(user.email);
          }
          let current_order = data.current_order;
          if (current_order != null && current_order != undefined && current_order != '') {
            DataParser.initCurrentOrder(current_order);
            Actions.orderInProgress({type: ActionConst.REPLACE})
          } else {
            Actions.presentation({type: ActionConst.REPLACE})
          }
        } catch (e) {
          console.log(e);
          this.setState({
            error: 'An unknown error occured. Please try again later'
          });
        }
      } else {
        SessionManager.setToken('');
        Functions.showAlert('', error.error ? error.error : "An unknown error has occurred. Please try again later.");
        Actions.login({type: ActionConst.REPLACE})
      }
    });
  }

  onLoginFBPressed() {
    this.setState({error: ''});
    FBLoginManager.loginWithPermissions(["email", "user_friends"], (error, data) => {
      if (!error) {
        console.log('facebook', data);
        let profile = null;
        if (data.profile) {
          profile = JSON.parse(data.profile);
        }
        if (!profile) {
          profile = {email: '', first_name: '', last_name: ''};
        }
        const { email, first_name, last_name } = profile;
        const { token, userId } = data.credentials;
        fb_token = token;
        fbid = userId;
        DataParser.updateUserInfo({email, first_name, last_name, fb_token, fbid});
        this.handleLoginFB();
      } else {
        console.log("Error: ", error);
        if (error.type != 'cancel') {
          Functions.showAlert('', error.error ? error.error : "An unknown error has occurred. Please try again later.");
        }
      }
    });
  }

  _handleLoginFailure(message = 'Login failed. Please try again') {
    this.setState({
      error: message,
      loading: false
    });
  }

  onLoginPressed() {
    let data = {
      email: this.state.email,
      password: this.state.password
    };

    // verify data is correctly formatted
    if(!Functions.validateForm('Email', data.email) || !Functions.validateForm('Password', data.password)) {
      return;
    }
    const {email, password} = this.state;
    this.setState({loading: true, error: ''});
    HttpClientHelper.login({email, password}, (error, data) => {
      try {
        if (!error) {
          const {success} = data;
          if (success) {
            // handle login success
            let token = HttpClientHelper.genBasicAuth(email, password);
            SessionManager.setToken(token);
            // call to next screen
            // Actions.presentation({type: ActionConst.REPLACE});
            this.handleLoggedIn();
          } else {
            this._handleLoginFailure();
          }
        } else {
          if (error.error) {
            this._handleLoginFailure(error.error);
          } else {
            this._handleLoginFailure();
          }
        }
      } catch (e) {
        this._handleLoginFailure();
      }
    });
  }

  renderForm() {
    return (
      <Form>
        <Item floatingLabel style={StyleSheet.flatten(styles.input)}>
            <Label style={StyleSheet.flatten(styles.inputLabel)}>Email</Label>
            <Input
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
              keyboardType="email-address"
              returnKeyType="next"
              autoCapitalize="none"
              style={StyleSheet.flatten(styles.inputField)}
            />
        </Item>
        <Item floatingLabel style={StyleSheet.flatten(styles.input)}>
            <Label style={StyleSheet.flatten(styles.inputLabel)}>Password</Label>
            <Input
              value={this.state.password}
              onChangeText={(password) => this.setState({password})}
              secureTextEntry={true}
              returnKeyType="go"
              autoCapitalize="none"
              style={StyleSheet.flatten(styles.inputField)}
            />
        </Item>
    </Form>
    )
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
          height: 350
        }}></View>
        <Content style={{padding: 20, backgroundColor:'transparent'}} ref='container'>
          <Image
            source={Images.pressLogoWhite}
            style={styles.logoImage}
            resizeMode='contain'
          />
          <Text style={styles.valueProp}>Laundry and dry cleaning, delivered</Text>
          <Panel>
            {this.renderForm()}
            <Text style={styles.errorText}>{this.state.error}</Text>
            <Button
              text="Log In"
              containerStyle={styles.loginButton}
              textStyle={styles.loginButtonText}
              onPress={this.onLoginPressed}
            />
          </Panel>
          <View style={styles.bottomButtons}>
            <Button
              text="Recover password"
              containerStyle={styles.forgotPasswordButton}
              textStyle={styles.forgotPasswordButtonText}
              onPress={this.handlePressForgotPassword}
            />
            <Button
              text="Sign up with email"
              containerStyle={styles.signUpButton}
              textStyle={styles.signUpButtonText}
              onPress={this.handlePressSignUp}
            />
          </View>
        </Content>
        <Button
          text="Connect with Facebook"
          containerStyle={styles.facebookButton}
          textStyle={styles.facebookButtonText}
          onPress={this.onLoginFBPressed}
        />
        <Spinner visible={this.state.loading} />
      </View>
    )
  }
}
