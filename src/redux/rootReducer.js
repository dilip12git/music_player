// rootReducer.js
import { combineReducers } from 'redux';
import selectedSongReducer from './selectedSongReducer';
import allSongsReducer from './allSongsReducer';
import isSongPlaying from './isSongPlaying';
import favSongsReducer from './favSongReducer';

const rootReducer = combineReducers({
    selectedSongReducer,
    allSongsReducer,
    isSongPlaying,
    favSongsReducer,


});

export default rootReducer;
