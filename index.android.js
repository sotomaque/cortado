// @flow

import { AppRegistry, UIManager } from 'react-native'
import App from './app'
UIManager.setLayoutAnimationEnabledExperimental(true);
AppRegistry.registerComponent('PressApp', () => App)
