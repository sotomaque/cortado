import React, { Component } from 'react';
import { View, TextInput, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Container, Content } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Button } from '../../components';
import { HttpClientHelper } from '../../libs';
import { User } from '../../beans';
import styles from './styles';
import * as Functions from '../../utils/Functions';

export default class PinVerification extends Component {

	constructor(props) {
		super(props);
		this.state = {
			pin: '',
			loading: false
		}
	}

	onContinuePressed = () => {
		if(!Functions.validateForm('Verification Number', this.state.pin))
			return;
		this.setState({loading: true});
    HttpClientHelper.post('phone_verification', {phone_number: User.phoneNumber, email: User.email, verification: this.state.pin},
      (error, data)=>{
				this.setState({loading: false});
        if(!error) {
					try {
						Actions.pop({popNum: 3})
					} catch (e) { console.log(e); }
					Actions.presentation({type: ActionConst.REPLACE});
        } else {
					Functions.showAlert('', 'Your verification number is invalid. Please try again later.');
        }
      }
    );
	}

	render() {
		return (<View style={styles.container}>
			<Container keyboardShouldPersistTaps='always'>
				<Content keyboardShouldPersistTaps='always'>
					<TextInput
            onChangeText={(val) => this.setState({pin: val})}
            style={styles.input} placeholder="Verification Number"
            keyboardType="phone-pad"
						underlineColorAndroid="transparent"
            dataDetectorTypes="phoneNumber" />
            <Button
              containerStyle={styles.button}
              textStyle={styles.buttonText}
              onPress={()=>this.onContinuePressed()}
              text="Finish Registration" />
				</Content>
				<Spinner visible={this.state.loading} />
			</Container>
		</View>);
	}
}
