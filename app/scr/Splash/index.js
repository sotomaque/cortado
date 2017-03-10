import React from 'react';
import { View, Image } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import { SessionManager } from '../../libs';
import { Images } from '../../themes';

export default class Splash extends React.Component {

  componentDidMount() {
    setTimeout(()=>{
      this.next();
    }, 1000)
  }

  next() {
    SessionManager.init((isLoggedIn)=>{
      if(isLoggedIn) {
        Actions.presentation({type: ActionConst.REPLACE})
      } else {
        Actions.login({type: ActionConst.REPLACE})
      }
    });
  }

  render() {
    return <View style={{justifyContent: 'center', flex: 1}}>
      <Image source={Images.logo2} style={{ alignSelf: 'center'}}/>
    </View>
  }
}
