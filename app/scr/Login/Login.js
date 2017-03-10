import React from 'react';
import { TextInput, Text, View, Image } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';

import { Touchable, Button } from '../../components';
import { Metrics, Images, Colors } from '../../themes';
import { HttpClientHelper, SessionManager } from '../../libs';
import styles from './styles';

export default class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      email: 'enrique@presscleaners.com',
      password: 'por!Qkikei7',
      error: '',
      loading: false
    }
  }

  handlePressSignUp = () => {
    Actions.register();
  }

  handlePressForgotPassword = () => {
    Actions.forgotPassword();
  }

  onLoginPressed = () => {
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
    return (<View style={styles.mainContainer}>
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
          disabled={true}
          text="LOGIN WITH FACEBOOK"
          containerStyle={styles.facebookButton}
          textStyle={styles.buttonText}
          onPress={this.onLoginPressed}/>
        <Text style={styles.errorText}>{this.state.error}</Text>
        <View style={styles.bottomButtons}>
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
        </View>
      </View>
      <Spinner visible={this.state.loading} />
    </View>)
  }
}
