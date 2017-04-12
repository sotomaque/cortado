import React from 'react';
import { NativeModules } from 'react-native';
import Picker from 'react-native-picker';

export default class TimePicker extends React.Component {

    static dropoff_times = {};
    static pickup='';

    static hide() {
        Picker.hide();
    }

    static show(date, time, data, title, subtitle, callback) {
        let dataPicker = [];
        let dataJson = JSON.parse(data);

        let isPickup = title.toUpperCase().indexOf('PICKUP') >= 0;

        if (isPickup) {
            TimePicker.dropoff_times = {};
            for (let i in dataJson) {
                let pickupDayConfig = dataJson[i];
                for (let pickupDayStr in pickupDayConfig) {
                    let newData = {};
                    newData[pickupDayStr] = pickupDayConfig[pickupDayStr].windows;
                    dataPicker.push(newData);
                    TimePicker.dropoff_times[pickupDayStr] = pickupDayConfig[pickupDayStr].dropoff_times;
                    break;
                }
            }
        } else {
            dataPicker = TimePicker.dropoff_times[TimePicker.pickup];
        }
        Picker.init({
            pickerConfirmBtnText: 'Save',
            pickerCancelBtnText: 'Cancel',
            pickerTitleText: title,
            pickerSubTitleText: subtitle,
            pickerCancelBtnColor: [89, 51, 175, 1],
            pickerConfirmBtnColor: [89, 51, 175, 1],
            pickerToolBarBg: [245, 245, 245, 1],
            pickerBg: [255, 255, 255, 1],
            pickerToolBarFontSize: 16,
            pickerFontSize: 16,
            pickerData: dataPicker,
            selectedValue: [date, time],
            onPickerConfirm: _data => {
                if (isPickup) {
                    TimePicker.pickup = _data[0];
                }
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
