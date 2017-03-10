import { Platform } from "react-native"
import SessionManager from './SessionManager'

import base64 from 'base-64'
import utf8 from 'utf8'

const BASE_URL  = "https://www.presscleaners.com/api"

const API_URL = {
  test: 'http://httpbin.org/post',
  login:                BASE_URL + '/login/',
  register:             BASE_URL + '/customer/register/',
  forgot_password:      BASE_URL + '/customer/register/',
  me:                   BASE_URL + '/customer/me/',
  phone_verification_create:   BASE_URL + 'phone_verification/create/',
  phone_verification:   BASE_URL + '/phone_verification/',
  world:                BASE_URL + '/world/',
  availability:         BASE_URL + '/availability/'
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

      try {
        if(HttpClientHelper.authorization==null || HttpClientHelper.authorization=='') {
          let token = await SessionManager.getToken();
          if(token && token!='')
            HttpClientHelper.authorization = token;
        }
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
        if(Object.keys(params).length) _url += "?" + Object.keys(params).map((k) => k + "=" + encodeURIComponent(params[k])).join("&")
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
      let response = await fetch(url, opts)
      let responseJson= await response.json()
      if(callback!=undefined) {
        callback(null, responseJson);
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
    let headers = params.headers;
    delete params.headers;
    return await HttpClientHelper.sendRequest(type, params, "POST", headers, callback);
  }

  static async get(type, params, callback) {
    let headers = params.headers;
    delete params.headers;
    return await HttpClientHelper.sendRequest(type, params, "GET", headers, callback);
  }

  static async put(type, params, callback) {
    let headers = params.headers;
    delete params.headers;
    return await HttpClientHelper.sendRequest(type, params, "PUT", headers, callback);
  }

  static async delete(type, params, callback) {
    let headers = params.headers;
    delete params.headers;
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
