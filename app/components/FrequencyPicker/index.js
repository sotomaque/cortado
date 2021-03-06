import React from 'react';
import { NativeModules } from 'react-native';
import Picker from 'react-native-picker';

export default class FrequencyPicker extends React.Component {

  static dropoff_times = {};
  static pickup='';

  static hide() {
    Picker.hide();
  }

  static show(date, time, data, title, subtitle, callback) {
    let dataPicker = [];
    let dataJson = JSON.parse(data);
    if(title.toUpperCase().indexOf('PICKUP')>=0) {
      FrequencyPicker.dropoff_times = {};
      for(let i in dataJson) {
        let dataI = dataJson[i];
        for(let j in dataI) {
            let dataJ = dataI[j];
            let newData = {};
            newData[j] = dataJ.windows;
            dataPicker.push(newData);
            FrequencyPicker.dropoff_times[j] = dataJ.dropoff_times;
            break;
        }
      }
    } else {
      dataPicker = FrequencyPicker.dropoff_times[FrequencyPicker.pickup];
    }
    console.log(dataPicker);
    Picker.init({
        pickerConfirmBtnText: 'Done',
        pickerCancelBtnText: 'Cancel',
        pickerTitleText: title,
        pickerSubTitleText: subtitle,
        pickerCancelBtnColor: [160, 160, 160, 1],
        pickerConfirmBtnColor: [109, 39, 161, 1],
        pickerToolBarBg: [255,255,255,1],
        pickerBg: [255,255,255,1],
        pickerData: dataPicker,
        selectedValue: [59],
        onPickerConfirm: _data => {
            FrequencyPicker.pickup = _data[0];
            callback(null, {date: _data[0], time: _data[1]});
        },
        onPickerCancel: _data => {
            console.log(_data);
            callback("onCancel", null);
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
