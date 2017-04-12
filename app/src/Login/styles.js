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
        width: 200,
        padding: 20,
        marginTop: 40,
        marginBottom: 0,
        alignSelf: 'center'
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
    valueProp: {
        textAlign: 'center',
        fontSize: 14,
        color: '#ffffff',
        fontFamily: 'OpenSans-SemiBold',
        marginBottom: 40,
        marginTop: 10
    },
    orSeperator: {
        fontFamily: 'OpenSans-SemiBold',
        color: '#aaa',
        padding: 6,
        paddingBottom: 10,
        fontSize: 13,
        alignSelf: 'center'
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
    loginButton: {
        height: 50,
        backgroundColor: '#4B2D8F',
        borderWidth: 0,
        borderColor: '#e0e0e0',
        alignSelf: 'stretch',
        marginTop: 30,
        justifyContent: 'center',
        borderRadius: 4
    },
    loginButtonText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 16,
        color: '#ffffff',
        alignSelf: 'center',
    },
    facebookButton: {
        height: 60,
        backgroundColor: '#3b5998',
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        bottom: 0
    },
    facebookButtonText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 17,
        color: '#FFF',
        alignSelf: 'center'
    },
    bottomButtons:{
        flex: 1,
        flexDirection: 'row',
        marginTop: 28
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
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: '#aaa',
        alignSelf: 'center',
        marginLeft: 20
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
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: '#aaa',
        alignSelf: 'center',
        marginRight: 20
    },
    errorText: {
        fontSize: 15,
        textAlign: 'left',
        color: 'red',
        marginTop: -10,
        marginBottom: 0
    }
});

export default styles;
