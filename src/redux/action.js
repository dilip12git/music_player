import { SELECTED_SONG, ALL_SONGS,IS_SONG_PLAYING,FAV_SONG } from "./constant";

export function selectedSong(item){
    return {
        type: SELECTED_SONG,
        data: item
    };
}
export const setAllSongs = (songs) => ({
    type: ALL_SONGS,
    payload: songs,
  });


  export const setIsSongPlaying = (isPlaying) => {
    return {
        type: IS_SONG_PLAYING,
        data: isPlaying
    };
};
export const setFavouritesSongs=(favSongs)=>{
  return {
    type:FAV_SONG,
    payload:favSongs
  };
};