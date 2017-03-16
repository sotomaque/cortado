import React from 'react';
import { NativeModules } from 'react-native';
const RNTimePicker = NativeModules.RNTimePicker;

export default class TimePicker extends React.Component {
  static show(date, time, data, title, subtitle, callback) {
      RNTimePicker.show(date, time, data, title, subtitle, (error, data)=>{
        callback(error, data);
      })
  }
  render() {
      return <View></View>
  }
}
