import { StyleSheet } from 'react-native'
import { Metrics, Images, Colors } from '../../themes';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
		marginTop: 0,
		backgroundColor: Colors.transparent
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
		padding: 20
  },
  heading: {
    alignSelf: 'center',
		fontSize: 30,
		fontFamily: 'AvenirNext-UltraLight',
		padding: 10,
		marginTop: (Metrics.screenHeight / 10)
  },
  input: {
    height: 50,
		marginTop: 10,
		padding: 10,
		fontSize: 18
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
    fontSize: 16,
		color: '#FFF',
		alignSelf: 'center'
  },
  cancelButton: {
    height: 50,
		alignSelf: 'stretch',
		marginTop: 10,
		justifyContent: 'center'
  },
  cancelButtonText: {
    fontSize: 22,
		color: '#000',
		alignSelf: 'center'
  }
});

export default styles;
