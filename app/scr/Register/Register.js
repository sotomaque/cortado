import React from 'react';
import { TextInput, Text, View, Image, Keyboard }	from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Content } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { Metrics, Images, Colors } from '../../themes';
import * as DataParser from '../../utils/DataParser';
import { Button } from '../../components';
import styles from './styles';
import { HttpClientHelper } from '../../libs'
import * as Functions from '../../utils/Functions';
import * as EmailValidator from 'email-validator';
import { NavigationBar } from '../../components';

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
		}
		this._keyboardDidShow = this._keyboardDidShow.bind(this)
		this._keyboardDidHide = this._keyboardDidHide.bind(this)
	}

	handlePressRegister = async () => {

		let data = {
			first_name: this.state.first_name,
			last_name: this.state.last_name,
			email: this.state.email,
			password: this.state.password
		};

		// verify data is correctly formatted
		if(!Functions.validateForm('First name', data.first_name)
		|| !Functions.validateForm('Last name', data.last_name)
		|| !Functions.validateForm('Email', data.email)
		|| !Functions.validateForm('Password', data.password)) {
			return;
		}

		if(data.email.indexOf("@")<0) {
      Functions.showAlert('', 'An email address must contain a single @');
      return;
    }

    let isEmailValid = await EmailValidator.validate(data.email);
    if(!isEmailValid) {
      Functions.showAlert('', 'Please enter a valid email');
      return;
    }
		DataParser.updateUserInfo(data);
		this.setState({loading: true});
		HttpClientHelper.get('validate', {email: data.email}, (error, _data)=>{
			this.setState({loading: false})
			if(!error) {
				if(_data.is_registered) {
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
			<View style={styles.mainContainer} keyboardShouldPersistTaps='always'>
				<Image source={Images.loginBackground} style={styles.backgroundImage} resizeMode='contain' />
				<Content style={{padding: 20, backgroundColor:'transparent'}} ref='container' keyboardShouldPersistTaps='always'>
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
            onPress={()=>this.handlePressRegister()}
            text="REGISTER"/>
						<View style={{height: 40, backgroundColor: 'transparent'}}/>
				</Content>
				{!this.state.keyboardShow&&<Button
          containerStyle={styles.cancelButton}
          textStyle={styles.cancelButtonText}
          onPress={()=>this.handlePressCancel()}
          text="Cancel"/>}
				<Spinner visible={this.state.loading} />
			</View>);
	}
}
