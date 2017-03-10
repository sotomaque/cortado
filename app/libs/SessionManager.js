import StorageHelper from './StorageHelper'
import HttpClientHelper from './HttpClientHelper'

class SessionManager {
  token = null;
  constructor() {

  }

  setToken(token) {
    this.token = token;
    StorageHelper.setToken(token);
  }

  logout() {
    this.token = undefined;
    StorageHelper.removeToken();
  }

  async getToken() {
    if(!this.token) {
      this.token = await StorageHelper.getToken();
    }
    return this.token;
  }

  async init(callback) {
    this.token = await StorageHelper.getToken();
    callback(this.isLoggedIn());
  }

  isLoggedIn() {
    if(this.token)
      return true;
    return false;
  }
}

export default new SessionManager();
