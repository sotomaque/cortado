import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Container, Content, Text } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';

import { Button } from '../../components';
import { HttpClientHelper, SessionManager } from '../../libs';
import { User } from '../../beans';
import styles from './styles';
import * as Functions from '../../utils/Functions';
import * as DataParser from '../../utils/DataParser';
import Analytics from '../../utils/analytics';
import { NavigationBar } from '../../components';


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
                this.setState({ loading: false });
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
                    Actions.presentation({type: ActionConst.REPLACE});
                } else {
                    Functions.showAlert('', 'An unexpected error occurred. Please try again later.');
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
                Functions.showAlert('', 'Invalid PIN. Please try again.');
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
                    <Text note style={{margin: 30, marginTop: 10, textAlign: 'left'}}>
                        {`*Your PIN has been texted to the number provided.`}
                    </Text>
                </Content>
                <Spinner visible={this.state.loading} />
            </Container>
        );
    }
}
