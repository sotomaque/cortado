import { StyleSheet } from 'react-native';
import { Metrics, Images, Colors } from '../../themes'

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
  logoImage: {
    height: 63,
    width: 220,
    padding: 20,
    marginTop: (Metrics.screenHeight / 10),
    alignSelf: 'center',
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
  seperator: {
    padding: 10,
    alignSelf: 'center'
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 10,
    fontSize: 18
  },
  button: {
    height: 40,
    backgroundColor: '#000',
    alignSelf: 'stretch',
    marginTop: Metrics.doubleBaseMargin,
    justifyContent: 'center',
    borderRadius: 4
  },
  facebookButton: {
    height: 40,
    backgroundColor: '#3B51A1',
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 4
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    alignSelf: 'center'
  },
  bottomButtons:{
    flex: 1,
    flexDirection: 'row'
  },
  forgotPasswordButton: {
    alignSelf: 'flex-start',
    height: 20,
    backgroundColor: 'rgba(255,255,255,0)',
    marginTop: 10,
    position: 'absolute',
    bottom: 0
  },
  forgotPasswordButtonText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 10,
    alignSelf: 'center'
  },
  signUpButton: {
    alignSelf: 'flex-end',
    height: 20,
    backgroundColor: 'rgba(255,255,255,0)',
    marginTop: 10,
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  signUpButtonText: {
    fontSize: 16,
    color: '#000',
    marginRight: 10,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
    color: 'red'
  }
});

export default styles;
