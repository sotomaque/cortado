import React, { Component } from 'react';
import { View, TextInput, Text } from 'react-native';
import { Container, Content } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { Actions } from 'react-native-router-flux';
import { Button } from '../../components';
import { HttpClientHelper } from '../../libs'
import { User } from '../../beans';
import styles from './styles';
import * as Functions from '../../utils/Functions';

export default class PhoneNumberVerification extends Component {

	constructor(props) {
		super(props);
		this.state = {
			phone: '',
			loading: false
		}
	}

	onContinuePressed = () => {
		if(!Functions.validateForm('Phone number', this.state.phone))
			return;
		this.setState({loading: true});
		User.phone_number = this.state.phone;
        HttpClientHelper.post( 'phone_verification_create', {phone_number: User.phone_number, email: User.email},
        (error, data)=>{
			this.setState({loading: false});
        if(!error) {
			Actions.pinVerification();
        } else {
			Functions.showAlert('', 'Please enter a valid phone number');
        }
      }
    );
	}

	render() {
		return (<View style={styles.container}>
			<Container keyboardShouldPersistTaps='always'>
				<Content keyboardShouldPersistTaps='always'>
					<TextInput
            onChangeText={(val) => this.setState({phone: val})}
            style={styles.input} placeholder="Mobile #"
            keyboardType="phone-pad"
						underlineColorAndroid="transparent"
            dataDetectorTypes="phoneNumber" />
            <Button
              containerStyle={styles.button}
              textStyle={styles.buttonText}
              onPress={this.onContinuePressed}
              text="Continue" />
				</Content>
				<Spinner visible={this.state.loading} />
			</Container>
		</View>);
	}
}
