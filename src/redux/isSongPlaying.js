// reducers.js
import { IS_SONG_PLAYING } from "./constant";

const initialState = false;

const isSongPlaying = (state = initialState, action) => {
    switch (action.type) {
        case IS_SONG_PLAYING:
            return action.data;
        default:
            return state;
    }
};

export default isSongPlaying;
