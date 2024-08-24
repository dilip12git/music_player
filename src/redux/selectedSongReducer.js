import { SELECTED_SONG } from "./constant";

const initialState = {};

const selectedSongReducer = (state = initialState, action) => {
    switch (action.type) {
        case SELECTED_SONG:
            return {
                ...state,
                ...action.data
            };
        default:
            return state;
    }
};

export default selectedSongReducer;
