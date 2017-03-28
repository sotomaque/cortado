import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Container, Content, Item, Input, Header } from 'native-base'
import { Metrics } from '../../themes'
import { NavigationBar, Button } from '../../components';
import { User } from '../../beans';
import { Actions } from 'react-native-router-flux';
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
		this.handleLoggedIn = this.handleLoggedIn.bind(this);
	}

	handleLoggedIn() {
	    this.setState({loading: true});
	    HttpClientHelper.get('world', null, (error, data)=>{
	      this.setState({loading: false});
	      if(!error) {
	        try {
	          let user = data.user;
	          if(user) {
	            user.intercom_enabled = data.intercom_enabled;
	            DataParser.initializeUser(user);
	          }
	        } catch (e) {
	          console.log(e);
	        }
	      } else {
	        Functions.showAlert('', error.error?error.error:"An unknown error has occurred. Please try again later");
	      }
	    });
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
				Functions.showAlert('', 'Your code is applied');
				this.handleLoggedIn();
				this.setState({
					code: User.total_free_credits
				})
			} else {
				Functions.showAlert('', error.error?error.error:'Your promo code is invalid. Please try again');
			}
		})
		this.setState({loading: false});
	}

	renderHeader() {
	    return (
	      <Header style={{backgroundColor: '#fff', height: Metrics.navBarHeight, paddingBottom: 3}}>
	        <Button containerStyle={{width: 80, justifyContent: 'center'}} onPress={()=>{
	          try {
	            Actions.pop();
	          } catch (e) {
	            console.log(e);
	          }
	        }}>
	          <Text style={{fontFamily: 'OpenSans', color: '#565656', fontSize: 14}}>Cancel</Text>
	        </Button>
	        <Button containerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5}}>
	          <Text style={{fontFamily: 'OpenSans-SemiBold', color: '#565656', fontSize: 18}}>Promotions</Text>
	        </Button>
	        <Button containerStyle={{width: 80, alignItems: 'flex-end', justifyContent: 'center'}} onPress={()=>this.handleSubmit()}>
	          <Text style={{fontFamily: 'OpenSans', color: this.state.code ?'#565656':'#ccc', fontSize: 14}}>Save</Text>
	        </Button>
	      </Header>
	    );
	}

	render() {
		return (
			<Container>
				{this.renderHeader()}
				<Content style={{marginBottom: Metrics.navBarHeight}}>
					<Item underline>
						<Input
							style={{fontFamily: 'OpenSans', textAlign: 'center', fontWeight: '100', color: 'grey'}}
							placeholder='Enter a promo code'
							value={this.state.code}
              				onChangeText={(val) => this.setState({code: val})}
              			/>
					</Item>
					<View ref='text' style={styles.text}>
						<Text style={{fontFamily: 'OpenSans', color: 'grey'}}>You currently have ${User.total_free_credits?User.total_free_credits:'0.00'} of credit</Text>
					</View>
				</Content>
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
