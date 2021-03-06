import { StyleSheet } from 'react-native';
import { Metrics, Images, Colors } from '../../themes'

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mapView: {
        flex: 1,
        width: (Metrics.screenWidth)
    },
    listView: {
        flex: 0,
        paddingTop: 10
    },
    buttons: {
        position: 'absolute',
        bottom: 0
    },
    row: {
        padding: 12,
        paddingLeft: 10
    },
    content: {
        marginLeft: 50
    },
    timeline: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 10,
        width: 50,
        justifyContent: 'center', // center the dot
        alignItems: 'center',
    },
    line: {
        position: 'absolute',
        top: 0,
        left: 24,
        width: 2,
        bottom: 0,
    },
    topLine: {
        flex: 1,
        width: 2,
        backgroundColor: '#EEEEEF',
    },
    bottomLine: {
        flex: 1,
        width: 2,
        backgroundColor: '#EEEEEF',
    },
    topLineActive: {
        flex: 1,
        width: 2,
        backgroundColor: '#51bd2b',
    },
    bottomLineActive: {
        flex: 1,
        width: 2,
        backgroundColor: '#51bd2b',
    },
    hiddenLine: {
        width: 0,
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#EEEEEF',
    },
    dotInProgress: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#deedd7'
    },
    dotComplete: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#53B826',
    },
    bottomButtonText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: '#222222'
    }
});

export default styles;
