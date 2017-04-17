import React, { Component } from 'react'
import { View, StyleSheet, Text, Platform } from 'react-native'
import { Container, Content, Item, Header } from 'native-base'
import { Metrics } from '../../themes';
import { Actions } from 'react-native-router-flux';
import {User} from '../../beans';
import { NavigationBar, Button } from '../../components';
import Share from 'react-native-share';

class FreePress extends Component {

	constructor(props) {
	    super(props);
 	}

 	renderHeader() {
	    return (
	      <Header style={{
            backgroundColor: '#fff',
            height: Metrics.navBarHeight,
            paddingBottom: Platform.OS == 'ios' ? 10 : 0,
            borderBottomColor: Platform.OS == 'ios' ? '#e0e0e0' : 'transparent',
            borderBottomWidth: 1.0
          }}>
	        <Button containerStyle={{width: 80, justifyContent: 'center'}} onPress={()=>{
	          try {
	            Actions.pop();
	          } catch (e) {
	            console.log(e);
	          }
	        }}>
	          <Text style={{fontFamily: 'OpenSans-SemiBold', color: '#565656', fontSize: 14}}>Done</Text>
	        </Button>
	        <Button containerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5}}>
	          <Text style={{color: '#565656', fontSize: 18, fontFamily: 'OpenSans-SemiBold'}}>Free Press</Text>
	        </Button>
	        <Button containerStyle={{width: 80, alignItems: 'flex-end', justifyContent: 'center'}} >
	        </Button>
	      </Header>
	    );
	}

	render() {
		return (
			<Container style={{backgroundColor: '#f2f3f6'}}>
				{this.renderHeader()}
				<Content scrollEnabled={false}>
					<View style={styles.main}>
						<Text ref='heading' style={styles.textHeading}>Give $10, Get $10</Text>
						<View style={styles.box}>
							<Text ref='code' style={styles.textCode}>{User.promo_code}</Text>
						</View>
						<Text style={styles.textSubtext}>Give friends $10 towards their first order. After order completion, you get $10 credit too.</Text>
					</View>
				</Content>
				<Button
					disabled={User.promo_code==''}
					containerStyle={{position: "absolute", height: 50, left: 20, bottom: 20, right: 20, backgroundColor: '#4B2D8F', borderRadius: 3, alignItems: 'center', justifyContent: 'center'}}
					text="Share Code"
					textStyle={{color: '#fff', fontSize: 16, fontFamily: 'OpenSans-Bold' }}
					onPress={()=>this.showShareActionSheet()}
				/>
			</Container>
		)
	}

	showShareActionSheet = () => {
		let shareOptions = {
			title: "Free Press",
			message: `Get $10 off your first laundry & dry cleaning delivery with Press. Sign up with my link: https://www.presscleaners.com/i/${User.promo_code}/`,
			url: this.props.url,
			subject: "Free Press" //  for email
		};
		setTimeout(() => {
			Share.open(shareOptions);
		}, 300);
	}

}

const styles = StyleSheet.create({
	main: {
		marginTop: 20
	},
	textHeading: {
		marginTop: 10,
		padding: 10,
		alignSelf: 'center',
		justifyContent: 'center',
		fontSize: 30,
		fontWeight: '200',
		fontFamily: 'OpenSans'
	},
	box: {
		marginTop: 15,
		padding: 10,
		borderRadius: 3,
		width: 180,
		alignSelf: 'center',
		borderColor: 'white',
		backgroundColor: 'white',
	},
	textCode: {
		alignSelf: 'center',
		justifyContent: 'center',
		fontSize: 24,
		color: '#333',
		fontFamily: 'OpenSans-Bold', 
	},
	textSubtext: {
		marginLeft: 20,
		marginRight: 20,
		marginTop: 20,
		alignSelf: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		color: 'grey',
		fontFamily: 'OpenSans'
	}
});

export default FreePress;
