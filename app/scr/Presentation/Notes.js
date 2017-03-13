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
				<Separator bordered>
        	<Text>Special Instructions (optional)</Text>
        </Separator>
        <Item underline>
          <Input
						style={{fontSize: 15}}
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
