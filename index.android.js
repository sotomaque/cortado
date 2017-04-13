// @flow

import { AppRegistry, UIManager } from 'react-native';
import { Client } from 'bugsnag-react-native';

import App from './app';


const bugsnag = new Client();
UIManager.setLayoutAnimationEnabledExperimental(true);
AppRegistry.registerComponent('PressApp', () => App)
