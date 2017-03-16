import { Alert, AlertIOS, Platform } from 'react-native';

export function validateForm(name, value, title='', callback=null) {
  if(value==null || value==undefined || value=='') {
    GLOBAL.requestAnimationFrame(() => {
      showAlert(title, name+' must be not empty.', callback )
    });
    return false;
  }
  return true;
}

export function showAlert(title, message, callback=null) {
  const oAlert = Platform.OS=='ios'?AlertIOS:Alert;
  GLOBAL.requestAnimationFrame(() => {
    oAlert.alert(
      title,
      message,
      [
        {text: 'OK', onPress: () => {
          if(callback!=null)
            callback();
        }},
      ]
    );
  });
}
