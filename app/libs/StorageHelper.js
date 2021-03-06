import { AsyncStorage } from "react-native"

export default class StorageHelper {

  static set(key, value){
    try {
      AsyncStorage.setItem(key, value)
    } catch (e) {console.log(e);}
  }

  static async get(key){
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (e) {console.log(e);}
    return null;
  }

  static remove(key){
    try {
      AsyncStorage.removeItem(key)
    } catch (e) { console.log(e);}
  }

  static removeToken() {
    try {
      AsyncStorage.removeItem('auth_token')
    } catch (e) { console.log(e);}
  }

  static setToken(token) {
    try {
      StorageHelper.set('auth_token', token);
    } catch (e) { console.log(e); }
  }

  static async getToken() {
    try {
      let token = await StorageHelper.get('auth_token');
      return token;
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  static removeUserInfo() {
    try {
      AsyncStorage.removeItem('user_info')
    } catch (e) { console.log(e);}
  }

  static setUserInfo(data) {
    try {
      StorageHelper.set('user_info', JSON.stringify(data));
    } catch (e) { console.log(e); }
  }

  static async getUserInfo() {
    try {
      let data = await StorageHelper.get('user_info');
      return JSON.parse(data);
    } catch (e) {
      console.log(e);
    }
    return null;
  }
}
