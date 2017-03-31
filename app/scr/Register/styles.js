import { StyleSheet } from 'react-native'
import { Metrics, Images, Colors } from '../../themes';

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		marginTop: 0,
		backgroundColor: Colors.transparent,
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
		alignSelf: 'center',
		fontSize: 30,
		fontFamily: 'OpenSans',
		padding: 10,
		marginTop: (Metrics.screenHeight / 10)
	},
	inputLeft: {
		height: 50,
		width: (Metrics.screenWidth / 2) - 20 ,
		marginTop: 10,
		padding: 10,
		fontSize: 18,
		fontFamily: 'OpenSans'
	},
	inputRight: {
		height: 50,
		alignSelf: 'flex-end',
		width: (Metrics.screenWidth / 2) - 20 ,
		marginTop: 10,
		padding: 10,
		fontSize: 18,
		fontFamily: 'OpenSans'
	},
	input: {
		height: 50,
		marginTop: 10,
		padding: 10,
		fontSize: 18,
		fontFamily: 'OpenSans'
	},
	button: {
	    height: 50,
	    marginLeft: 5,
		marginRight: 5,
		marginTop: 30,
	    backgroundColor: '#222',
	    alignSelf: 'stretch',
	    justifyContent: 'center',
		borderRadius: 3
 	},
	buttonText: {
		fontSize: 22,
		color: '#FFF',
		alignSelf: 'center',
		fontFamily: 'OpenSans'
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
		fontSize: 22,
		color: '#000',
		alignSelf: 'center',
		fontFamily: 'OpenSans'
	}
});

export default styles;
