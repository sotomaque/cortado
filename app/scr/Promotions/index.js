import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Container, Content, Item, Input } from 'native-base'
import {Metrics} from '../../themes'
import { NavigationBar } from '../../components';

class Promotion extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			promo: ''
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Container>
					<NavigationBar title='Promotions' />
					<Content>
						<Item underline>
							<Input
								placeholder='Enter a promo code to apply discount'
                				onChangeText={(val) => this.setState({promo: val})}/>
						</Item>
						<View ref='text' style={styles.text}>
							<Text>You currently have $0.00 of credit</Text>
						</View>
					</Content>
				</Container>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	text: {
		marginTop: 10,
		padding: 10,
		alignSelf: 'center',
		justifyContent: 'center'
	}
});

export default Promotion
