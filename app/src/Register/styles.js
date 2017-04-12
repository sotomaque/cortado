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
		fontSize: 32,
	    textAlign: 'center',
		fontFamily: 'OpenSans-SemiBold',
		padding: 10,
		marginTop: 40,
	    color: '#ffffff'
	},
	subHeading: {
		fontSize: 14,
		textAlign: 'center',
		width: 300,
		alignSelf: 'center',
		fontFamily: 'OpenSans-SemiBold',
		backgroundColor: 'transparent',
		padding: 10,
		marginTop: -15,
		marginBottom: 25,
		color: '#ffffff'
	},
	inputLeft: {
		width: '47%',
	},
	inputRight: {
		width: '47%',
		marginLeft: '6%'
	},
	input: {
        marginBottom: 10,
        marginTop: 0,
        marginLeft: 0,
        borderBottomColor: '#e8e8e8'
    },
    inputLabel: {
        fontFamily: 'OpenSans-SemiBold',
        color: '#888888'
    },
    inputField: {
        fontFamily: 'OpenSans',
        fontSize: 20
    },
	button: {
		height: 50,
	  	marginTop: 30,
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
		backgroundColor: 'transparent'
	},
	cancelButtonText: {
		fontSize: 15,
		color: '#555555',
		alignSelf: 'center',
		fontFamily: 'OpenSans-SemiBold'
	}
});

export default styles;
