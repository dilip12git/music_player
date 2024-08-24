import { ALL_SONGS } from "./constant";


const initialState = [];

const allSongsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ALL_SONGS:
            return action.payload;
        default:
            return state;
    }
};

export default allSongsReducer;