import React from 'react';
import { TextInput, Text, View, Image, Keyboard } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
var { FBLoginManager } = require('react-native-facebook-login');

import { Touchable, Button } from '../../components';
import { Metrics, Images, Colors } from '../../themes';
import { HttpClientHelper, SessionManager } from '../../libs';
import styles from './styles';
import * as DataParser from '../../utils/DataParser';
import * as Functions from '../../utils/Functions';
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
    this._keyboardDidShow = this._keyboardDidShow.bind(this)
		this._keyboardDidHide = this._keyboardDidHide.bind(this)
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
    Actions.register();
  }

  handlePressForgotPassword() {
    Actions.forgotPassword();
  }

  handleLoginFB() {
    this.setState({loading: true});
    HttpClientHelper.post('login_fb', DataParser.getLoginFBData(), (error, data)=>{
      this.setState({loading: false});
      if(!error) {
        SessionManager.setToken(HttpClientHelper.genBasicAuth(User.email, data.token));
        setTimeout(()=>{
          Actions.presentation({type: ActionConst.REPLACE});
        }, 200);
      } else {
        //show error
        Functions.showAlert('', "An unknown error has occurred. Please try again later");
      }
    })
  }

  onLoginFBPressed() {
    FBLoginManager.loginWithPermissions(["email","user_friends"], (error, data)=>{
      if (!error) {
        console.log(data);
        const { email, first_name, last_name } = JSON.parse(data.profile);
        const { token, userId } = data.credentials;
        fb_token = token;
        fbid = userId;
        DataParser.updateUserInfo({email, first_name, last_name, fb_token, fbid})
        this.handleLoginFB();
      } else {
        console.log("Error: ", error);
        Functions.showAlert('', "An unknown error has occurred. Please try again later");
      }
    });
  }

  onLoginPressed() {
    this.setState({loading: true});
    const {email, password} = this.state;
    HttpClientHelper.login({email, password}, (error, data)=>{
      this.setState({loading: false});
      if(!error) {
        // handle login success
        const {success} = data;
        if(success) {
          let token = HttpClientHelper.genBasicAuth(email, password);
          SessionManager.setToken(token);
          // call to next screen
          Actions.presentation({type: ActionConst.REPLACE});
        } else {
          this.setState({
            error: 'Cannot login! Please try again'
          })
        }
        console.log(data);
      } else {
        // handle error
        this.setState({
          error: 'Cannot login! Please try again'
        })
      }
    });
  }

  render() {
    return (<View style={styles.mainContainer} keyboardShouldPersistTaps='always'>
      <Image source={Images.loginBackground} style={styles.backgroundImage} resizeMode='stretch' />
      <View style={styles.container} ref='container'>
        <Image source={Images.pressMarketing} style={styles.logoImage} resizeMode='contain' />
        <TextInput
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="next"
          autoCapitalize="none"/>
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({password})}
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          returnKeyType="go"
          autoCapitalize="none"/>
        <Button
          text="LOGIN"
          containerStyle={styles.button}
          textStyle={styles.buttonText}
          onPress={this.onLoginPressed}/>
        <Text style={styles.seperator}>OR</Text>
        <Button
          text="LOGIN WITH FACEBOOK"
          containerStyle={styles.facebookButton}
          textStyle={styles.buttonText}
          onPress={this.onLoginFBPressed}/>
        <Text style={styles.errorText}>{this.state.error}</Text>
        {!this.state.keyboardShow&&<View style={styles.bottomButtons}>
          <Button
            text="FORGOT PASSWORD"
            containerStyle={styles.forgotPasswordButton}
            textStyle={styles.forgotPasswordButtonText}
            onPress={this.handlePressForgotPassword}/>
          <Button
            text="SIGN UP"
            containerStyle={styles.signUpButton}
            textStyle={styles.signUpButtonText}
            onPress={this.handlePressSignUp}/>
        </View>}
      </View>
      <Spinner visible={this.state.loading} />
    </View>)
  }
}
