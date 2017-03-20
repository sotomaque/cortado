import React from 'react';
import { NativeModules } from 'react-native';
import Picker from 'react-native-picker';

export default class TimePicker extends React.Component {

  static dropoff_times = {};
  static pickup='';

  static show(date, time, data, title, subtitle, callback) {
    let dataPicker = [];
    let dataJson = JSON.parse(data);
    if(title.toUpperCase().indexOf('PICKUP')>=0) {
      TimePicker.dropoff_times = {};
      for(let i in dataJson) {
        let dataI = dataJson[i];
        for(let j in dataI) {
            let dataJ = dataI[j];
            let newData = {};
            newData[j] = dataJ.windows;
            dataPicker.push(newData);
            TimePicker.dropoff_times[j] = dataJ.dropoff_times;
            break;
        }
      }
    } else {
      dataPicker = TimePicker.dropoff_times[TimePicker.pickup];
    }
    console.log(dataPicker);
    Picker.init({
        pickerConfirmBtnText: 'Done',
        pickerCancelBtnText: 'Cancel',
        pickerTitleText: title,
        pickerCancelBtnColor: [160, 160, 160, 1],
        pickerConfirmBtnColor: [109, 39, 161, 1],
        pickerBg: [255,255,255,1],
        pickerData: dataPicker,
        selectedValue: [59],
        onPickerConfirm: _data => {
            TimePicker.pickup = _data[0];
            callback(null, {date: _data[0], time: _data[1]});
        },
        onPickerCancel: _data => {
            console.log(_data);
        },
        onPickerSelect: _data => {
            console.log(_data);
        }
    });
    Picker.show();
  }
  render() {
      return <View></View>
  }
}
