import { StyleSheet } from 'react-native';
import { Metrics } from '../../themes';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonNext: {
    height: Metrics.navBarHeight,
    width: Metrics.screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4b3486'
  },
  buttonNextInActive: {
    height: Metrics.navBarHeight,
    width: Metrics.screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9285b3'
  },
});

export default styles;
