import { StyleSheet } from 'react-native';
import { Metrics, Images, Colors } from '../../themes'

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#f2f3f6'
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
    width: 160,
    padding: 20,
    marginTop: 16,
    marginBottom: 22,
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
    fontFamily: 'OpenSans',
    padding: 10,
    marginTop: (Metrics.screenHeight / 10)
  },
  orSeperator: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#aaa',
    padding: 6,
    paddingBottom: 10,
    fontSize: 12,
    alignSelf: 'center'
  },
  input: {
    marginBottom: 10
  },
  loginButton: {
    height: 43,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignSelf: 'stretch',
    marginTop: Metrics.doubleBaseMargin,
    justifyContent: 'center',
    borderRadius: 4
  },
  loginButtonText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#777',
    alignSelf: 'center',
  },
  facebookButton: {
    height: 43,
    backgroundColor: '#3B5998',
    alignSelf: 'stretch',
    justifyContent: 'center',
    borderRadius: 4,
    marginBottom: 0
  },
  facebookButtonText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
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
    fontFamily: 'OpenSans',
    fontSize: 15,
    color: '#999',
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
    fontFamily: 'OpenSans-Bold',
    fontSize: 15,
    color: '#555',
    marginRight: 10,
    alignSelf: 'center'
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
    color: 'red',
    marginTop: 15
  }
});

export default styles;
