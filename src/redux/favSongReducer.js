import { FAV_SONG } from "./constant";


const initialState = [];

const favSongsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FAV_SONG:
            return action.payload;
        default:
            return state;
    }
};

export default favSongsReducer;