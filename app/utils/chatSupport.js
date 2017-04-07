import { Alert, AlertIOS, Platform } from 'react-native';
import Intercom from 'react-native-intercom';
import Permissions from 'react-native-permissions';

import { User } from '../beans';


export default {
    identifyUser: function(email) {
        if (email !== "" && email !== null) {
            Intercom.registerIdentifiedUser({ email: "" + User.email })
            .then(() => {
                console.log('registerIdentifiedUser done');
                Intercom.handlePushMessage();
            })
            .catch((err) => {
                console.log('registerIdentifiedUser ERROR', err);
            });
        } else {
            console.log('[ChatSupport] Cannot identify User - email is null or blank.');
        }
    },

    open: function() {
        if (Platform.OS === 'ios') {
            Permissions.getPermissionStatus('notification')
            .then(response => {
                console.log('Notification permission: ' + response);
                this._callbackForNotificationPermission(response).bind(this)();
            })
            .catch((err) => {
                console.log('[ERROR] Get Notification Permission Status', err);
            });
        } else {
            this._openChat();
        }
    },

    reset: function() {
        Intercom.reset();
    },

    _callbackForNotificationPermission: function(permission) {
        const responseToFn = {
            'authorized': this._handleAuthorizedPermission,
            'restricted': this._handleRestrictedPermission,
            'undetermined': this._handleUndeterminedPermission,
            'denied': this._handleDeniedPermission
        };

        return responseToFn[permission];
    },

    _openChat: function() {
        GLOBAL.requestAnimationFrame(() => {
            Intercom.displayMessageComposer();
        });
    },

    _handleAuthorizedPermission: function() {
        this._openChat();
    },

    _handleRestrictedPermission: function() {
        this._openChat();
    },

    _handleUndeterminedPermission: function() {
        Alert.alert(
            '"Press" Would Like to Send You Notifications',
            'Notifications must be enabled to receive replies from our customer success team.',
            [
                {
                    text: "Don't Allow",
                    onPress: () => {
                        console.log('permission denied');
                    }
                },
                {
                    text: 'Allow',
                    onPress: () => {
                        Permissions.requestPermission('notification', ['alert', 'badge', 'sound'])
                        .then(response => {
                            if (response == 'authorized') {
                                this._openChat();
                            }
                        })
                        .catch((err) => {
                            console.log('[ERROR] Get Notification Permission Status', err);
                        });
                    }
                }
            ]
        );
    },

    _handleDeniedPermission: function() {
        Alert.alert(
            'Enable live chat support?',
            'Notifications must be enabled to receive replies.',
            [
                {
                    text: 'Cancel',
                    onPress: () => {
                        console.log('permission denied');
                    }
                },
                {
                    text: 'Enable',
                    onPress: Permissions.openSettings
                }
            ]
        );
    }
};
