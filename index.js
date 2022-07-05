/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React from 'react';
import TrackPlayer from 'react-native-track-player';

import {PlaybackService} from './src/services/PlaybackService';
import 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => PlaybackService);
