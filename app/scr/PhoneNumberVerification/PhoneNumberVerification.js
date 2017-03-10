import React, { Component } from 'react';
import { View, TextInput, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { Button } from '../../components';
import { HttpClientHelper } from '../../libs'
import { User } from '../../beans';

class PhoneNumberVerification extends Component {

	constructor(props) {
		super(props);
		this.state = {
			phone: ''
		}
	}

	onContinuePressed = () => {
		User.phoneNumber = this.state.phone;
    HttpClientHelper.post(
      'phone_verification_create',
      {phone_number: User.phoneNumber, email: User.email},
      (error, data)=>{
        if(!error) {
					Actions.pinVerification();
        } else {

        }
      }
    );
	}

	render() {
		return (<View style={styles.container}>
			<Container>
				<Content>
					<TextInput
            onChangeText={(val) => this.setState({phone: val})}
            style={styles.input} placeholder="Mobile #"
            keyboardType="phone-pad"
            dataDetectorTypes="phoneNumber" />
            <Button
              containerStyle={styles.button}
              textStyle={styles.buttonText}
              onPress={this.onContinuePressed}
              text="Continue" />
				</Content>
			</Container>
		</View>);
	}
}
