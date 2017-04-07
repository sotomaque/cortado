import StorageHelper from './StorageHelper';
import HttpClientHelper from './HttpClientHelper';
import * as DataParser from '../utils/DataParser';
import ChatSupport from '../utils/chatSupport';


class SessionManager {
    token = null;

    constructor() {

    }

    setToken(token) {
        this.token = token;
        StorageHelper.setToken(token);
    }

    logout() {
        HttpClientHelper.authorization = null;
        this.token = undefined;
        StorageHelper.removeToken();
        StorageHelper.removeUserInfo();
        try {
            ChatSupport.reset();
        } catch (e) {

        }
    }

    async getToken() {
        if (!this.token) {
            this.token = await StorageHelper.getToken();
        }
        return this.token;
    }

    saveUserInfo() {
        try {
            let data = DataParser.getUserInfo();
            StorageHelper.setUserInfo(data);
        } catch (e) {
            console.log(e);
        }
    }

    async init(callback) {
        this.token = await StorageHelper.getToken();
        try {
            let data = await StorageHelper.getUserInfo();
            if (data) {
                DataParser.initializeUser(data);
            }
        } catch (e) {
            console.log(e);
        }
        callback(this.isLoggedIn());
    }

    isLoggedIn() {
        if (this.token) {
            return true;
        }
        return false;
    }
}

export default new SessionManager();
