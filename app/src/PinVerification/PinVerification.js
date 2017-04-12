import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Container, Content, Text } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';

import * as Functions from '../../utils/Functions';
import * as DataParser from '../../utils/DataParser';
import styles from './styles';
import Analytics from '../../utils/analytics';
import { ACCOUNT_CREATED } from '../../utils/analyticsEvents';
import { NavigationBar } from '../../components';
import { Button } from '../../components';
import { HttpClientHelper, SessionManager } from '../../libs';
import { User } from '../../beans';


export default class PinVerification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pin: '',
            loading: false,
            isValid: false
        };
    }

    finishRegister() {
        this.setState({loading: true});
        HttpClientHelper.post('register', DataParser.getRegistrationData(),
            (error, data) => {
                this.setState({loading: false});
                if (!error) {
                    try {
                        let token = HttpClientHelper.genBasicAuth(User.email, User.password);
                        SessionManager.setToken(token);
                    } catch (e) {
                        console.log(e);
                    }
                    try {
                        Actions.pop({popNum: 3});
                    } catch (e) {
                        console.log(e);
                    }
                    Analytics.identifyUserByEmail(User.email);
                    Analytics.sendEvent(ACCOUNT_CREATED);
                    Actions.presentation({type: ActionConst.REPLACE});
                } else {
                    if (error.hasOwnProperty('error')) {
                        Functions.showAlert('', error.error);
                    } else {
                        Functions.showAlert('', 'Unable to complete registration. Contact support or try again later.');
                    }
                }
            }
        );
    }

    onContinuePressed = () => {
        if (!Functions.validateForm('Verification PIN', this.state.pin)) {
            return;
        }
        this.setState({loading: true});
        HttpClientHelper.post('phone_verification', {phone_number: User.phone_number, email: User.email, verification: this.state.pin}, (error, data) => {
            if (!error) {
                this.finishRegister();
            } else {
                this.setState({loading: false});
                if (error.hasOwnProperty('error')) {
                    Functions.showAlert('', error.error);
                } else {
                    Functions.showAlert('', 'Unable to verify pin. Contact support or try again later.');
                }
            }
        });
    }

    render() {
        return (
            <Container>
                <NavigationBar title="Create Account 3/3" />
                <Content style={{backgroundColor: '#f2f3f6'}}>
                    <TextInput
                        onChangeText={(val) => {
                            this.setState({
                                pin: val,
                                isValid: val.length == 6
                            });
                        }}
                        underlineColorAndroid="transparent"
                        style={styles.input}
                        placeholder="Verification PIN"
                        keyboardType="phone-pad"
                        underlineColorAndroid="transparent"
                        dataDetectorTypes="phoneNumber"
                    />
                    <Button
                        disabled={!this.state.isValid}
                        containerStyle={this.state.isValid ? styles.button : styles.buttonInActive}
                        textStyle={styles.buttonText}
                        onPress={() => this.onContinuePressed()}
                        text="Finish Registration"
                    />
                    <Text note style={{fontFamily:'OpenSans-SemiBold', margin: 30, marginTop: 10, textAlign: 'left'}}>
                        {"Enter the verification pin sent to " + User.phone_number + " to finish registration."}
                    </Text>
                </Content>
                <Spinner visible={this.state.loading} />
            </Container>
        );
    }
}
