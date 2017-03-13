import React from 'react';
import { View, Image } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Images } from '../../themes';
import * as DataParser from '../../utils/DataParser';
import {Address, User} from '../../beans';
import { HttpClientHelper, SessionManager } from '../../libs';

export default class Splash extends React.Component {

  componentDidMount() {
    this.next();
  }

  handleLoggedIn() {
    HttpClientHelper.get('me', null, (error, data)=>{
      if(!error) {
        DataParser.initializeUser(data);
        let current_order = data.current_order;
        if(current_order!=null && current_order!=undefined && current_order!='') {
          DataParser.initCurrentOrder(current_order);
          Actions.orderInProgress({type: ActionConst.REPLACE})
        } else {
          Actions.presentation({type: ActionConst.REPLACE})
        }
      } else {
        SessionManager.setToken('');
        Actions.login({type: ActionConst.REPLACE})
      }
    });
  }

  next() {
    SessionManager.init((isLoggedIn)=>{
      if(isLoggedIn) {
        this.handleLoggedIn();
      } else {
        setTimeout(()=>{
          Actions.login({type: ActionConst.REPLACE})
        }, 1000)
      }
    });
  }

  render() {
    return <View style={{justifyContent: 'center', flex: 1}}>
      <Image source={Images.logo2} style={{ alignSelf: 'center'}}/>
    </View>
  }
}
