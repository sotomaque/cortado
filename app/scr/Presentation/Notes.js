// /Components/notes.js

'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';
import { Separator, Text, Item, Input } from 'native-base';

class Notes extends Component {
	props: NotesProps

	render() {
		return (
			<View>
				<Separator bordered>
	              <Text>Special Instructions (optional)</Text>
	            </Separator>
	            <Item underline>
	              <Input placeholder='Any garments we should pay special attention to?' 
	                onChangeText={(val) => this.setState({specialInstructions: val})}/>
	            </Item>
			</View>
		)
	}
}

export default Notes; 