import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { Actions } from 'react-native-router-flux';
import { TextInput, Text, View, Image, Keyboard, StyleSheet, StatusBar } from 'react-native';
import { Container, Content, Item, Input, Label, Form } from 'native-base';
import * as EmailValidator from 'email-validator';

import * as DataParser from '../../utils/DataParser';
import * as Functions from '../../utils/Functions';
import { Metrics, Images, Colors } from '../../themes';
import { Button } from '../../components';
import { HttpClientHelper } from '../../libs'
import { NavigationBar, Panel } from '../../components';
import styles from './styles';

export default class Register extends React.Component {

	constructor() {
		super();
		this.state = {
			first_name: "",
			last_name: "",
			email: "",
			password: "",
			errors: [],
			loading: false,
			keyboardShow: false,
		};
		this._keyboardDidShow = this._keyboardDidShow.bind(this);
		this._keyboardDidHide = this._keyboardDidHide.bind(this);
	}

	handlePressRegister = async () => {

		let data = {
			first_name: this.state.first_name,
			last_name: this.state.last_name,
			email: this.state.email,
			password: this.state.password,
			fbid: ''
		};

		// verify data is correctly formatted
		if (!Functions.validateForm('First name', data.first_name)
		|| !Functions.validateForm('Last name', data.last_name)
		|| !Functions.validateForm('Email', data.email)
		|| !Functions.validateForm('Password', data.password)) {
			return;
		}

		if (data.email.indexOf("@") < 0) {
     		Functions.showAlert('', 'An email address must contain a single @');
	     	return;
	    }

	    let isEmailValid = await EmailValidator.validate(data.email);
	    if (!isEmailValid) {
			Functions.showAlert('', 'Please enter a valid email');
			return;
	    }
		DataParser.updateUserInfo(data);
		this.setState({loading: true});
		HttpClientHelper.get('validate', {email: data.email}, (error, _data) => {
			this.setState({loading: false})
			// TODO: use api error message for errors
			if (!error) {
				if (_data.is_registered) {
					Functions.showAlert('', 'Email already registered');
				} else {
					Actions.phoneNumberVerification();
				}
			} else {
				Functions.showAlert('', 'Email already registered');
			}
		})

	}

	handlePressCancel() {
		Actions.pop();
	}

	_keyboardDidShow () {
		this.setState({keyboardShow: true})
	}

	_keyboardDidHide () {
		this.setState({keyboardShow: false})
	}

	componentWillMount () {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	}

	componentWillUnmount () {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	render() {
		return (
			<View style={styles.mainContainer}>
				<StatusBar barStyle="light-content"/>
				<View style={{
		          backgroundColor: '#4B2D8F',
		          position: 'absolute',
		          left: 0,
		          top: 0,
		          right: 0,
		          height: 350
		        }}></View>
				<Content style={{padding: 20, backgroundColor:'transparent'}} ref='container'>
					<Text style={styles.heading}>Sign Up</Text>
					<Text style={styles.subHeading}>We just need a few details to get started.</Text>
					<Panel>
						<Form>
							<View style={{flex: 1, flexDirection: 'row'}}>
				              	<Item floatingLabel style={StyleSheet.flatten([styles.input, styles.inputLeft])}>
					                <Label style={StyleSheet.flatten(styles.inputLabel)}>First Name</Label>
					                <Input
										onChangeText={(val) => this.setState({first_name: val})}
										returnKeyType="next"
										style={StyleSheet.flatten(styles.inputField)}
					                />
				              	</Item>
				              	<Item floatingLabel style={StyleSheet.flatten([styles.input, styles.inputRight])}>
					                <Label style={StyleSheet.flatten(styles.inputLabel)}>Last Name</Label>
					                <Input
										onChangeText={(val) => this.setState({last_name: val})}
										returnKeyType="next"
										style={StyleSheet.flatten(styles.inputField)}
					                />
				              	</Item>
				            </View>
			              	<Item floatingLabel style={StyleSheet.flatten(styles.input)}>
				                <Label style={StyleSheet.flatten(styles.inputLabel)}>Email</Label>
				                <Input
									onChangeText={(val) => this.setState({email: val})}
									returnKeyType="next"
									style={StyleSheet.flatten(styles.inputField)}
									autoCapitalize="none"
									keyboardType="email-address"
				                />
			              	</Item>
			              	<Item floatingLabel style={StyleSheet.flatten(styles.input)}>
				                <Label style={StyleSheet.flatten(styles.inputLabel)}>Password</Label>
				                <Input
									onChangeText={(val) => this.setState({password: val})}
									returnKeyType="go"
									style={StyleSheet.flatten(styles.inputField)}
									autoCapitalize="none"
									secureTextEntry={true}
				                />
			              	</Item>
			            </Form>
			            <Button
							containerStyle={styles.button}
							textStyle={styles.buttonText}
							onPress={()=>this.handlePressRegister()}
							text="Submit"
						/>
					</Panel>
          			
					<View style={{height: 40, backgroundColor: 'transparent'}} />
				</Content>
				{!this.state.keyboardShow && <Button
					containerStyle={styles.cancelButton}
					textStyle={styles.cancelButtonText}
					onPress={()=>this.handlePressCancel()}
					text="Go Back"
				/>}
				<Spinner visible={this.state.loading} />
			</View>
		);
	}
}
