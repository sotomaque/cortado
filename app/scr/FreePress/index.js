import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Container, Content, Item, Header } from 'native-base'
import {Metrics} from '../../themes';
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
	      <Header style={{backgroundColor: '#fff', height: Metrics.navBarHeight, paddingBottom: 3}}>
	        <Button containerStyle={{width: 80, justifyContent: 'center'}} onPress={()=>{
	          try {
	            Actions.pop();
	          } catch (e) {
	            console.log(e);
	          }
	        }}>
	          <Text style={{color: '#565656', fontSize: 14, fontWeight :'bold'}}>Done</Text>
	        </Button>
	        <Button containerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1, padding: 5}}>
	          <Text style={{color: '#565656', fontSize: 18, fontWeight :'bold'}}>Free Press</Text>
	        </Button>
	        <Button containerStyle={{width: 80, alignItems: 'flex-end', justifyContent: 'center'}} >
	        </Button>
	      </Header>
	    );
	}

	render() {
		return (
			<Container>
				{this.renderHeader()}
				<Content>
					<View style={styles.main}>
						<Text ref='heading' style={styles.textHeading}>Give $10, Get $10</Text>
						<View style={styles.box}>
							<Text ref='code' style={styles.textCode}>{User.promo_code}</Text>
						</View>
						<Text style={styles.textSubtext}>Give friends $10 towards their first order. After order completion, you will recieve a $10 as well.</Text>
					</View>
				</Content>
				<Button
					disabled={User.promo_code==''}
					containerStyle={{position: "absolute", height: 50, left: 10, bottom: 10, right: 10, backgroundColor: '#4b3486', borderRadius: 3, alignItems: 'center', justifyContent: 'center'}}
					text="SHARE"
					textStyle={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}
					onPress={()=>this.showShareActionSheet()}
				/>
			</Container>
		)
	}

	showShareActionSheet = () => {
		let shareOptions = {
      title: "Free Press",
      message: `Get free orders from Press Application. Use promotion code ${User.promo_code} to get $10`,
      url: this.props.url,
      subject: "Free Press" //  for email
    };
		setTimeout(() => {
      Share.open(shareOptions);
    },300);
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
		fontWeight: '200'
	},
	box: {
		marginTop: 15,
		padding: 14,
		borderRadius: 3,
		marginLeft: 50,
		marginRight: 50,
		borderColor: 'white',
		backgroundColor: 'white',
	},
	textCode: {
		alignSelf: 'center',
		justifyContent: 'center',
		fontSize: 28,
		fontWeight: 'bold'
	},
	textSubtext: {
		marginTop: 20,
		alignSelf: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		color: 'grey'
	}
});

export default FreePress;
