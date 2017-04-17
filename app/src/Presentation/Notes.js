// /Components/notes.js

'use strict';

import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { Separator, Text, Input } from 'native-base';

class Notes extends Component {
	props: NotesProps

	constructor(props) {
		super(props);
		this.state = {
			special_instructions: '',
			isFocused: false
		};
	}

	getText() {
		return this.state.special_instructions;
	}

	render() {
		return (
			<View>
				<Separator style={{backgroundColor: '#f2f3f6'}}>
		        	<Text style={{color: '#AAAAAA', fontSize: 14, marginTop: 6, fontFamily: 'OpenSans'}}>Special Instructions (optional)</Text>
		        </Separator>
		        <View style={{
		        	borderTopWidth: 1.0,
					borderBottomWidth: 1.0,
					borderColor: '#e8e8e8'
		        }}>
					<TextInput
						style={{
							fontSize: 13,
							fontFamily: 'OpenSans-SemiBold',
							height: this.state.isFocused ? 120 : 66,
							marginLeft: 15,
							paddingTop: 5
						}}
						underlineColorAndroid='transparent'
						multiline={true}
						placeholder={'Any garments we should pay special attention to?'}
						value={this.state.special_instructions}
						onChangeText={(val) => this.setState({special_instructions: val})}
						onFocus={() => this.setState({isFocused: true})}
						onEndEditing={() => this.setState({isFocused: false})}
					/>
				</View>
			</View>
		)
	}
}

export default Notes;
