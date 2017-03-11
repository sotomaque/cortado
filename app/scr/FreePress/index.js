import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Container, Content, Item, Input, Footer, FooterTab, Button } from 'native-base'
import {Metrics} from '../../themes';
import {User} from '../../beans';
import { NavigationBar } from '../../components';
import Share from 'react-native-share';

class FreePress extends Component {

	constructor(props) {
	    super(props);

	    this.state = {
	      promoCode: User.promoCode
	    };
 	}

	render() {
		return (
			<View style={styles.container}>
				<Container>
					<NavigationBar title='Free Press' />
					<Content>

						<View style={styles.main}>
							<Text ref='heading' style={styles.textHeading}>Give $10, Get $10</Text>

							<Text ref='code' style={styles.textCode}>{this.state.promoCode}</Text>

							<Text style={styles.textSubtext}>Give friends $10 towards their first order. After order completion, you will recieve a $10 as well.</Text>
						</View>

					</Content>
				</Container>
				<Footer >
		            <FooterTab>
		                <Button
		                	onPress={this.showShareActionSheet}>
		                    <Text>Share Code</Text>
		                </Button>
		            </FooterTab>
        		</Footer>
			</View>
		)
	}

	showShareActionSheet = () => {
		let shareOptions = {
      title: "React Native",
      message: "message to go with the shared url",
      url: this.props.url,
      subject: "a subject to go in the email heading" //  for email
    };
		// var text;
		// if (success) {
		// 	text = `Shared via ${method}`;
		// } else {
		// 	text = 'You didn\'t share';
		// }
		// this.setState({text});
		setTimeout(() => {
      Share.open(shareOptions);
    },300);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	main: {
		marginTop: 20
	},
	textHeading: {
		marginTop: 10,
		padding: 10,
		alignSelf: 'center',
		justifyContent: 'center',
		fontSize: 30,
		fontFamily: 'AvenirNext-UltraLight'
	},
	textCode: {
		marginTop: 10,
		padding: 10,
		alignSelf: 'center',
		justifyContent: 'center',
		fontSize: 22,
		fontFamily: 'AvenirNext-Heavy',
	},
	textSubtext: {
		alignSelf: 'center',
		justifyContent: 'center',
		textAlign: 'center'
	}
});

export default FreePress;
