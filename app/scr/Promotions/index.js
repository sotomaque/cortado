import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Container, Content, Item, Input } from 'native-base'
import { Metrics } from '../../themes'
import { NavigationBar, Button } from '../../components';
import { User } from '../../beans';
import { HttpClientHelper } from '../../libs';
import * as Functions from '../../utils/Functions';
import Spinner from 'react-native-loading-spinner-overlay';

class Promotion extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			code: '',
			loading: false
		}
	}

	handleSubmit() {
		if(!Functions.validateForm('Promotion code', this.state.code))
			return;

		let params = {
			url_params: {
				code: this.state.code,
			}
		}
		this.setState({loading: true});
		HttpClientHelper.post('promotion', params, (error, params)=>{
			this.setState({loading: false});
			if(!error) {

			} else {
				Functions.showAlert('', 'Your promo code is invalid or expired. Please try again later');
			}
		})
	}

	render() {
		return (
			<Container>
				<NavigationBar title='Promotions' />
				<Content style={{marginBottom: Metrics.navBarHeight}}>
					<Item underline>
						<Input
							style={{textAlign: 'center'}}
							placeholder='Enter a promo code to apply discount'
							value={this.state.code}
              onChangeText={(val) => this.setState({code: val})}/>
					</Item>
					<View ref='text' style={styles.text}>
						<Text>You currently have ${User.total_free_credits?User.total_free_credits:'0.00'} of credit</Text>
					</View>
				</Content>
				<Button
	        disabled={this.state.score==''}
	        containerStyle={{position: "absolute", height: 50, left: 10, bottom: 10, right: 10, backgroundColor: this.state.score==''?'#999':'#000', borderRadius: 3, alignItems: 'center', justifyContent: 'center'}}
	        text="SUBMIT"
	        textStyle={{color: '#fff', fontSize: 16}}
	        onPress={()=>this.handleSubmit()}
	      />
				<Spinner visible={this.state.loading} />
			</Container>
		)
	}
}

const styles = StyleSheet.create({
	text: {
		marginTop: 10,
		padding: 10,
		alignSelf: 'center',
		justifyContent: 'center'
	}
});

export default Promotion
