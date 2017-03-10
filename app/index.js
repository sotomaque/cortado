import React from 'react';
import { View } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';

//Screens
import {
  ForgotPassword,
  PhoneNumberVerification,
  PinVerification,
  Login,
  Presentation,
  Register,
  Splash,
} from './scr'

const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>
    <Scene key="splash" component={Splash} initial={true}/>
    <Scene key="login" component={Login}/>
    <Scene key="register" component={Register}/>
    <Scene key="phoneNumberVerification" component={PhoneNumberVerification}/>
    <Scene key="pinVerification" component={PinVerification}/>
    <Scene key="forgotPassword" component={ForgotPassword}/>
    <Scene key="presentation" component={Presentation}/>
  </Scene>
);

export default class App extends React.Component {
  render() {
    return <Router scenes={scenes} duration={200}/>
  }
}
