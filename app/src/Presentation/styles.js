import { StyleSheet } from 'react-native';
import { Metrics } from '../../themes';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    sectionContainer: {
        backgroundColor: '#FFFFFF'
    },
    serviceItemCheckbox: {
        borderColor: '#D5D5D5',
        backgroundColor: null,
        borderRadius: 1,
        borderWidth: 1,
        width: 21,
        height: 21,
        paddingLeft: 3,
        paddingTop: 2,
        marginRight: 12
    },
    serviceItemCheckboxSelected: {
        borderColor: '#4B2D8F',
        backgroundColor: '#4B2D8F',
        borderRadius: 1,
        borderWidth: 1,
        width: 21,
        height: 21,
        paddingLeft: 3,
        paddingTop: 2,
        marginRight: 12
    },
    primaryButton: {
        height: Metrics.navBarHeight,
        width: Metrics.screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4B2D8F'
    },
    primaryButtonInactive: {
        height: Metrics.navBarHeight,
        width: Metrics.screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9285b3'
    },
    primaryButtonText: {
        fontFamily: 'OpenSans-Bold',
        color: '#fff',
        fontSize: 16
    }
});

export default styles;
