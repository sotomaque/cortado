import { Alert } from 'react-native';

export function validateForm(name, value, title='', callback=null) {
  if(value==null || value==undefined || value=='') {
    showAlert(title, name+' must be not empty.', callback )
    return false;
  }
  return true;
}

export function showAlert(title, message, callback=null) {
  Alert.alert(
    title,
    message,
    [
      {text: 'OK', onPress: () => {
        if(callback!=null)
          callback();
      }},
    ]
  );
}
