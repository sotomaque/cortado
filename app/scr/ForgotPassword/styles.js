import { StyleSheet } from 'react-native'
import { Metrics, Images, Colors } from '../../themes';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  	marginTop: 0,
  	backgroundColor: '#F2F3F6'
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
  	fontSize: 24,
    textAlign: 'center',
  	fontFamily: 'OpenSans-SemiBold',
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
  input: {
    marginLeft: 0,
    marginTop: 0
  },
  button: {
  	height: 50,
  	marginTop: 20,
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
    height: 60,
  	alignSelf: 'stretch',
  	marginTop: 10,
  	justifyContent: 'center'
  },
  cancelButtonText: {
    fontSize: 15,
  	color: '#555555',
  	alignSelf: 'center',
  	fontFamily: 'OpenSans-SemiBold'
  }
});

export default styles;
