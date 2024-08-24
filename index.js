/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import { Provider } from 'react-redux';
import store from './src/redux/store.js';

const AppRedux=()=>(
    <Provider store={store}>
        <App/>
    </Provider>
)
AppRegistry.registerComponent(appName, () => AppRedux);
TrackPlayer.registerPlaybackService(()=>require('./service.js'));