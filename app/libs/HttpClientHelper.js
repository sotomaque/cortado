import { Platform } from "react-native"
import SessionManager from './SessionManager'

import base64 from 'base-64'
import utf8 from 'utf8'

const BASE_URL  = "https://www.presscleaners.com/api"

const API_URL = {
  login:                BASE_URL + '/login/',
  login_fb:             BASE_URL + '/fb_login/',
  register:             BASE_URL + '/customer/register/',
  forgot_password:      BASE_URL + '/password_reset_request/',
  me:                   BASE_URL + '/customer/me/',
  phone_verification_create:   BASE_URL + '/phone_verification/create/',
  phone_verification:   BASE_URL + '/phone_verification/',
  world:                BASE_URL + '/world/',
  availability:         BASE_URL + '/availability/',
  payment:              BASE_URL + '/payment/',
  address:              BASE_URL + '/address/',
  order:                BASE_URL + '/order/',
  order_rating:         BASE_URL + '/order/{order_id}/rating/',
  pricing:              BASE_URL + '/pricing/',
  promotion:            BASE_URL + '/promo_code/{code}/redeem/',
  validate:             BASE_URL + '/validate/',
}

export default class HttpClientHelper {

  static mHeaders = {
    "Content-Type": "application/json",
    "HeaderField-Accept": "application/json",
  }
  static authorization = null

  static async sendRequest(type, params, method, headers, callback) {
    if(!(type in API_URL)) {
      if(callback!=undefined)
        callback("No API for type: "+type, null)
      return {error: "No API for type: "+type};
    }
    let url = "";
    try {
      url = API_URL[type]
      if(headers==null || headers==undefined) headers = {};
      for(let i in HttpClientHelper.mHeaders) {
        headers[i] = HttpClientHelper.mHeaders[i]
      }

      if(params!=null && params.url_params != undefined) {
        let url_params = params.url_params;
        for(let i in url_params) {
          url = url.replace("{"+i+"}", url_params[i]);
        }
        delete params.url_params;
      }

      try {
        if(HttpClientHelper.authorization==null || HttpClientHelper.authorization=='') {
          let token = await SessionManager.getToken();
          if(token && token!='')
            HttpClientHelper.authorization = token;
        }
        if(HttpClientHelper.authorization)
          headers['Authorization'] = 'Basic ' + HttpClientHelper.authorization;
      } catch (e) {
        console.log(e);
      }

      // opts
      let opts = {
        method: method,
        headers: headers
      }

      // Method GET
      if(method == "GET") {
        if(params!=null && Object.keys(params).length) url += "?" + Object.keys(params).map((k) => k + "=" + encodeURIComponent(params[k])).join("&")
      } else { // Method POST
        let formData  = new FormData()
        if(headers!=null && headers["Content-Type"] == "application/json") {
          if(params)
            opts.body = JSON.stringify(params);
        } else {
          for(let i in params) {
            formData.append(i, params[i]);
          }
          opts.body = formData;
        }
      }
      console.log(opts);
      console.log(url);
      let response = await fetch(url, opts)
      let responseJson = null;
      if(response.status>=200 && response.status<=299) {
        responseJson= await response.json()
        if(callback!=undefined) {
          callback(null, responseJson);
        }
      } else {
        if(callback!=undefined) {
          callback(response, null);
        }
        console.warn("HttpError", response);
      }
      return responseJson
    } catch(e) {
      console.warn("HttpError", e);
      console.log("HttpError", url);
      console.log("HttpError", params);
      if(callback!=undefined) {
        callback(e, null);
      }
      return {error: e};
    }
  }

  static async post(type, params, callback) {
    let headers = null;
    if(params!=null && params.headers!=undefined) {
      headers = params.headers;
      delete params.headers;
    }
    return await HttpClientHelper.sendRequest(type, params, "POST", headers, callback);
  }

  static async get(type, params, callback) {
    let headers = null;
    if(params!=null && params.headers!=undefined) {
      headers = params.headers;
      delete params.headers;
    }
    return await HttpClientHelper.sendRequest(type, params, "GET", headers, callback);
  }

  static async put(type, params, callback) {
    let headers = null;
    if(params!=null && params.headers!=undefined) {
      headers = params.headers;
      delete params.headers;
    }
    return await HttpClientHelper.sendRequest(type, params, "PUT", headers, callback);
  }

  static async delete(type, params, callback) {
    let headers = null;
    if(params!=null && params.headers!=undefined) {
      headers = params.headers;
      delete params.headers;
    }
    return await HttpClientHelper.sendRequest(type, params, "DELETE", headers, callback);
  }

  static async login(params, callback) {
    const {email, password} = params;
    HttpClientHelper.authorization = HttpClientHelper.genBasicAuth(email, password);
    return await HttpClientHelper.sendRequest('login', null, "POST", null, callback);
  }

  static genBasicAuth(email, password) {
    try {
      var utf8str = email + ':' + password;
  		return base64.encode(utf8str);
    } catch (e) {
      console.log(e);
    }
    return null;
  }
}
