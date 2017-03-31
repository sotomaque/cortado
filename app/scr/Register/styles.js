import { StyleSheet } from 'react-native'
import { Metrics, Images, Colors } from '../../themes';

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		marginTop: 0,
		backgroundColor: '#f2f3f6',
	},
	backgroundImage: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	},
	container: {
		flex: 1,
		paddingTop: Metrics.baseMargin,
		padding: 20,
	},
	heading: {
		fontSize: 24,
	    textAlign: 'center',
		fontFamily: 'OpenSans-Semibold',
		padding: 10,
		marginTop: 20,
	    color: '#333'
	},
	subHeading: {
		fontSize: 14,
		textAlign: 'center',
		width: 300,
		alignSelf: 'center',
		fontFamily: 'OpenSans',
		padding: 10,
		marginTop: -15,
		marginBottom: 15,
		color: '#999a9a'
	},
	inputLeft: {
		width: '47%',
	},
	inputRight: {
		width: '47%',
		marginLeft: '6%'
	},
	input: {
		marginLeft: 0,
		marginTop: 0,
		marginBottom: 10,
	},
	button: {
		height: 46,
	  	marginTop: 10,
	  	backgroundColor: '#4B2D8F',
	  	alignSelf: 'stretch',
	  	justifyContent: 'center',
	  	borderRadius: 4
 	},
	buttonText: {
		fontSize: 16,
	  	color: '#FFF',
	  	alignSelf: 'center',
	  	fontFamily: 'OpenSans-Bold'
	},
	cancelButton: {
		height: 50,
		alignSelf: 'stretch',
		marginTop: 10,
		justifyContent: 'center',
		position: 'absolute',
		left: 20,
		right:20,
		bottom: 5,
	},
	cancelButtonText: {
		fontSize: 15,
		color: '#555555',
		alignSelf: 'center',
		fontFamily: 'OpenSans-Semibold'
	}
});

export default styles;
