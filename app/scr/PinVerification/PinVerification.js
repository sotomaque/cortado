import React, { Component } from 'react';
import { View, TextInput, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { Button } from '../../components';
import { HttpClientHelper } from '../../libs';
import { User } from '../../beans';

class PinVerification extends Component {

	constructor(props) {
		super(props);
		this.state = {
			pin: ''
		}
	}

	onContinuePressed = () => {
    HttpClientHelper.post(
      'phone_verification',
      {phone_number: User.phoneNumber, email: User.email, pin: this.state.pin},
      (error, data)=>{
        if(!error) {

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
            onChangeText={(val) => this.setState({pin: val})}
            style={styles.input} placeholder="Verification Number"
            keyboardType="phone-pad"
            dataDetectorTypes="phoneNumber" />
            <Button
              containerStyle={styles.button}
              textStyle={styles.buttonText}
              onPress={this.onContinuePressed}
              text="Finish Registration" />
				</Content>
			</Container>
		</View>);
	}
}
