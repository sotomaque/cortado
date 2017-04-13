// @flow

import { AppRegistry } from 'react-native';
import { Client } from 'bugsnag-react-native';

import App from './app';


const bugsnag = new Client();
AppRegistry.registerComponent('PressApp', () => App);
