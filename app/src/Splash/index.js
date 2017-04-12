import React, { Component } from 'react';
import { View, TouchableHighlight, Image, Text, StyleSheet } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';

import * as DataParser from '../../utils/DataParser';
import { Images } from '../../themes';
import { Address, User } from '../../beans';
import { HttpClientHelper, SessionManager } from '../../libs';
import Analytics from '../../utils/analytics';
import PushNotifications from '../../utils/pushNotifications';


export default class Splash extends Component {

    componentDidMount() {
        Analytics.setup();
        PushNotifications.init();
        this.next();
    }

    handleLoggedIn() {
        HttpClientHelper.get('world', null, (error, data) => {
            if (!error) {
                try {
                    let user = data.user;
                    if (user) {
                        user.intercom_enabled = data.intercom_enabled;
                        DataParser.initializeUser(user);
                        Analytics.identifyUserByEmail(user.email);
                    }
                    let current_order = data.current_order;
                    if (current_order != null && current_order != undefined && current_order != '') {
                        DataParser.initCurrentOrder(current_order);
                        Actions.orderInProgress({type: ActionConst.REPLACE});
                    } else {
                        Actions.presentation({type: ActionConst.REPLACE});
                    }
                } catch (e) {
                    console.log('Error during Splash:handleLoggedIn');
                    console.log(e);
                }
            } else {
                Functions.showAlert('', error.error ? error.error : "An unknown error has occurred. Please try again later");
                SessionManager.setToken('');
                Actions.login({type: ActionConst.REPLACE});
            }
        });
    }

    next() {
        SessionManager.init((isLoggedIn) => {
            if (isLoggedIn) {
                this.handleLoggedIn();
            } else {
                setTimeout(() => {
                    Actions.login({type: ActionConst.REPLACE});
                }, 1000);
            }
        });
    }

    render() {
        return (
            <View style={{justifyContent: 'center', flex: 1}}>
                <Image source={Images.logo2} style={{ alignSelf: 'center'}}/>
            </View>
        )
    }
}
