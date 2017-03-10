import { StyleSheet } from 'react-native'
import { Metrics, Images, Colors } from '../../themes';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: Metrics.navBarHeight
	},
	text: {
		marginTop: 10,
		padding: 10,
		alignSelf: 'center',
		justifyContent: 'center'
	},
	input: {
		textAlign: 'center',
	    height: 50,
	    margin: 20,
	    fontSize: 18,
	    borderWidth: 0.5,
    	borderColor: '#0f0f0f',

	},
	button: {
	    height: 40,
	    margin: 20,
	    backgroundColor: '#3B51A1',
	    alignSelf: 'stretch',
	    justifyContent: 'center'
 	},
 	buttonText: {
	    fontSize: 18,
	    color: 'white',
	    alignSelf: 'center'
	}
});

export default styles;
