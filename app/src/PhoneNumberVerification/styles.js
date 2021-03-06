import { StyleSheet } from 'react-native'
import { Metrics, Images, Colors } from '../../themes';

const styles = StyleSheet.create({
	mainContainer: {
        flex: 1,
        marginTop: 0,
        backgroundColor: '#f2f3f6'
    },
    container: {
        flex: 1
    },
	text: {
		marginTop: 10,
		padding: 10,
		alignSelf: 'center',
		justifyContent: 'center'
	},
	input: {
		textAlign: 'center',
		height: 60,
		margin: 30,
		fontSize: 30,
		fontFamily: 'OpenSans'
	},
	button: {
		height: 50,
		marginLeft: 30,
		marginRight: 30,
		backgroundColor: '#4B2D8F',
		alignSelf: 'stretch',
		justifyContent: 'center',
		borderRadius: 4
 	},
	buttonInActive: {
		height: 50,
		marginLeft: 30,
		marginRight: 30,
		backgroundColor: '#ccc',
		alignSelf: 'stretch',
		justifyContent: 'center',
		borderRadius: 4
 	},
 	buttonText: {
		fontSize: 16,
		color: 'white',
		alignSelf: 'center',
		fontFamily: 'OpenSans-Bold'
	}
});

export default styles;
