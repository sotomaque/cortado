import React from 'react';
import { TextInput, Text, View, Image, ScrollView }	from 'react-native';
import { Actions } from 'react-native-router-flux';

import { Metrics, Images, Colors } from '../../themes';
import * as DataParser from '../../utils/DataParser';
import { Button } from '../../components';
import styles from './styles';
import { HttpClientHelper } from '../../libs'

export default class Register extends React.Component {

	constructor() {
		super();
		this.state = {
			first_name: "",
			last_name: "",
			email: "",
			password: "",
			errors: []
		}
	}

	handlePressRegister = () => {
		// verify data is correctly formatted
		let data = {
			firstName: this.state.first_name,
			lastName: this.state.last_name,
			email: this.state.email,
			password: this.state.password
		};
		DataParser.updateUserWithRegistration(data);
		HttpClientHelper.post(
			'register',
			DataParser.getRegistrationData(),
			(error, data)=>{
				if(!error) {
					console.log(data);
					Actions.phoneNumberVerification();
				} else {
				}
			}
		);
	}

	handlePressCancel = () => {
		Actions.pop();
	}

	render() {
		return (
			<View style={styles.mainContainer}>
				<Image source={Images.loginBackground} style={styles.backgroundImage} resizeMode='contain' />
				<ScrollView style={styles.container} ref='container'>
					<Text style={styles.heading}>SIGN UP</Text>
					<View style={{flex: 1, flexDirection: 'row'}}>
						<TextInput
							onChangeText={(val) => this.setState({first_name: val})}
							style={styles.inputLeft} placeholder="First Name"
							returnKeyType="next"/>
						<TextInput
							onChangeText={(val) => this.setState({last_name: val})}
							style={styles.inputRight} placeholder="Last Name"
							returnKeyType="next"/>
					</View>
					<TextInput
						onChangeText={(val) => this.setState({email: val})}
						style={styles.input} placeholder="Email"
						keyboardType="email-address"
						returnKeyType="next"
						autoCapitalize="none"/>
					<TextInput
						onChangeText={(val) => this.setState({password: val})}
						style={styles.input} placeholder="Password"
						secureTextEntry={true}
						returnKeyType="go"
						autoCapitalize="none"/>
          <Button
            containerStyle={styles.button}
            textStyle={styles.buttonText}
            onPress={this.handlePressRegister}
            text="Register"/>
				</ScrollView>
        <Button
          containerStyle={styles.cancelButton}
          textStyle={styles.cancelButtonText}
          onPress={this.handlePressCancel}
          text="Cancel"/>
			</View>);
	}
}
