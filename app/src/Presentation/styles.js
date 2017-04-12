import { StyleSheet } from 'react-native';
import { Metrics } from '../../themes';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    sectionContainer: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1.0,
        borderBottomWidth: 1.0,
        borderColor: '#e8e8e8'
    },
    serviceItemCheckbox: {
        borderColor: '#D5D5D5',
        backgroundColor: null,
        borderRadius: 2,
        borderWidth: 1,
        width: 22,
        height: 22,
        paddingLeft: 4,
        paddingTop: 1,
        marginRight: 14
    },
    serviceItemCheckboxSelected: {
        borderColor: '#4B2D8F',
        backgroundColor: '#4B2D8F',
        borderRadius: 2,
        borderWidth: 1,
        width: 22,
        height: 22,
        paddingLeft: 4,
        paddingTop: 1,
        marginRight: 14
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
        fontSize: 17
    }
});

export default styles;
