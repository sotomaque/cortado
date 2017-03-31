import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Content, Text } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { Actions } from 'react-native-router-flux';
import { Button } from '../../components';
import { HttpClientHelper } from '../../libs'
import { User } from '../../beans';
import styles from './styles';
import * as Functions from '../../utils/Functions';
import { NavigationBar } from '../../components';
import {TextInputMask} from 'react-native-masked-text';

export default class PhoneNumberVerification extends Component {

	constructor(props) {
		super(props);
		this.state = {
			phone: '',
			rawValue: '',
			loading: false,
			isValid: false
		}
	}

	onContinuePressed = () => {
		if(!Functions.validateForm('Phone number', this.state.rawValue))
			return;
		this.setState({loading: true});
		User.phone_number = this.state.rawValue;
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
		return (
			<Container>
				<NavigationBar title="Create Account 2/3" />
				<Content style={{backgroundColor: '#f2f3f6'}}>
					<TextInputMask
						style={styles.input}
						placeholder="Mobile #"
						onChangeText={(val)=>{
							let rawValue = this.myPhoneNumber.getRawValue();
							this.setState({
								phone: val,
								rawValue: rawValue,
								isValid: rawValue.length>=10
							})
						}}
						underlineColorAndroid="transparent"
						value={this.state.phone}
            ref={ref=>this.myPhoneNumber=ref}
						options={{
							dddMask: "999-999-9999",
						}}
            type={'cel-phone'} />
          <Button
						disabled={!this.state.isValid}
            containerStyle={this.state.isValid ? styles.button : styles.buttonInActive}
            textStyle={styles.buttonText}
            onPress={()=>this.onContinuePressed()}
            text="Send Verification PIN" />
					<Text note style={{fontFamily:'OpenSans', margin: 30, marginTop: 10, textAlign: 'left'}}>{`*Your number is needed for contact during pickups and dropoffs.`}</Text>
				</Content>
				<Spinner visible={this.state.loading} />
			</Container>
		);
	}
}
