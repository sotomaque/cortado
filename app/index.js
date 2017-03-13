import React from 'react';
import { View } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';

//Screens
import {
  ForgotPassword,
  FreePress,
  Login,
  OrderInProgress,
  OrderRating,
  Payment,
  PhoneNumberVerification,
  PinVerification,
  Presentation,
  Pricing,
  Promotions,
  Register,
  SetAddress,
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
    <Scene key="promotions" component={Promotions} title="Promotions"/>
    <Scene key="pricing" component={Pricing} title="Pricing"/>
    <Scene key="freePress" component={FreePress} title="Free Press"/>
    <Scene key="setAddress" component={SetAddress} title="Set Address"/>
    <Scene key="payment" component={Payment} title="Payment"/>
    <Scene key="orderInProgress" component={OrderInProgress} title="Order In Progress" initial={false}/>
    <Scene key="orderRating" component={OrderRating} title="Order Rating" initial={false}/>
  </Scene>
);

export default class App extends React.Component {
  render() {
    return <Router scenes={scenes} duration={200}/>
  }
}
