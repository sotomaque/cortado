// /Components/notes.js

'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';
import { Separator, Text, Item, Input } from 'native-base';

class Notes extends Component {
	props: NotesProps

	constructor(props) {
		super(props);
		this.state = {
			special_instructions: ''
		};
	}

	getText() {
		return this.state.special_instructions;
	}

	render() {
		return (
			<View>
				<Separator style={{backgroundColor: '#f2f3f6'}} bordered>
		        	<Text style={{color: '#AAAAAA', fontSize: 13, marginTop: 6}}>Special Instructions (optional)</Text>
		        </Separator>
		        <Item underline style={{borderColor: '#e0e0e0'}}>
					<Input
						style={{fontSize: 13, fontFamily: 'OpenSans-SemiBold', opacity: 0.5, paddingTop: 0}}
						placeholder={'Any garments we should pay special attention to?'}
						value={this.state.special_instructions}
						onChangeText={(val) => this.setState({special_instructions: val})}
					/>
		        </Item>
			</View>
		)
	}
}

export default Notes;
