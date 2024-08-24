import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  useColorScheme,
  FlatList,
  ToastAndroid,
  Modal, TouchableWithoutFeedback, Pressable
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { faEllipsisVertical, faMusic, faPlay } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux'
import { selectedSong, setIsSongPlaying, setFavouritesSongs } from '../../redux/action';
import TrackPlayer from 'react-native-track-player';
import AsyncStorage from '@react-native-async-storage/async-storage';


const FavSongs = ({ navigation }) => {
  const dispatch = useDispatch()
  const selectedItem = useSelector((state) => state.selectedSongReducer);
  const favSongs = useSelector((state) => state.favSongsReducer);
  const isSongPlaying = useSelector((state) => state.isSongPlaying);
  const isDarkMode = useColorScheme() === 'dark';
  const [rmSongItem, setrmSongItem] = useState();
  const themeColor = isDarkMode ? Colors.white : Colors.black;
  const bgTheme = isDarkMode ? Colors.black : Colors.white;
  const dimColorTheme = isDarkMode ? Colors.light : Colors.darker;
  const [openRemovefromFav, setopenRemovefromFav] = useState(false);

  useEffect(() => {

  }, [favSongs]);


  const handleSongItem = async (item) => {
    if (selectedItem && selectedItem.url === item.url && isSongPlaying) {
      ToastAndroid.show('Already Playing...', ToastAndroid.SHORT);
    }
    else {
      dispatch(selectedSong(item));
      storeSelectedSong(item);
      await TrackPlayer.play();
      dispatch(setIsSongPlaying(true));
    }


  }

  const storeSelectedSong = async (song) => {
    try {
      if (song) {
        await AsyncStorage.setItem('lastPlayedSong', JSON.stringify(song));
      }
    } catch (error) {
      console.error('Failed to store selected song:', error);
    }
  };


  const openBottomSheetOption = (songItem) => {
    setrmSongItem(songItem);
    setopenRemovefromFav(true);
  }
  const addMoreSongs = () => {
    navigation.navigate('AddToFavourites');
  }

  const removeFromfav = async () => {
    try {
      if (!rmSongItem || !rmSongItem.url) {
        console.error('Invalid song object:', rmSongItem);
        return;
      }
      let favSongsArray = [];
      const existingSongs = await AsyncStorage.getItem('favSongs');

      if (existingSongs !== null) {
        favSongsArray = JSON.parse(existingSongs);
        const existingIndex = favSongsArray.findIndex(item => item.url === rmSongItem.url);
        if (existingIndex !== -1) {
          favSongsArray.splice(existingIndex, 1);
          await AsyncStorage.setItem('favSongs', JSON.stringify(favSongsArray));
          ToastAndroid.show('Removed from favourites.', ToastAndroid.SHORT);
          setopenRemovefromFav(false);
        }
      }
      dispatch(setFavouritesSongs(favSongsArray));

    } catch (e) {
      console.error('Failed to add item to array:', e);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItem && selectedItem.url === item.url;

    return (
      <View style={{ marginTop: 4, marginBottom: 15, paddingLeft: 5, paddingRight: 5 }}>
        <View style={[, { flexDirection: 'row', gap: 5, padding: 8, alignItems: 'center', justifyContent: 'space-between' }]}>
          <TouchableOpacity
            style={{ flexDirection: 'row', gap: 10, alignItems: 'center', flex: 1 }}
            onPress={() => handleSongItem(item)}
            onLongPress={() => openBottomSheetOption(item)}
          >
            <View style={[styles.musicIconContainer, { backgroundColor: '#E82255' }]}>
              <FontAwesomeIcon icon={faMusic} size={18} color={'white'} />
            </View>
            <View style={{ flexDirection: 'column', gap: 5, alignContent: 'center', width: 220 }}>
              <Text style={[styles.songName, { color: isSelected ? '#E82255' : themeColor }]} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
              <View style={[styles.songInfo, { flexDirection: 'row', gap: 4, alignItems: 'center' }]}>
                <Text style={{ color: isSelected ? '#E82255' : dimColorTheme, fontSize: 10 }}>{item.artist}</Text>
                <Text style={{ color: isSelected ? '#E82255' : dimColorTheme, fontSize: 10 }}>-</Text>
                <Text style={{ color: isSelected ? '#E82255' : dimColorTheme, fontSize: 10 }}>{item.album}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openBottomSheetOption(item)} >
            <FontAwesomeIcon icon={faEllipsisVertical} size={16} style={{ color: 'grey' }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: bgTheme }}>
      <View style={[styles.frequentlyUsedContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
          <Text style={{ color: 'grey' }}>{favSongs.length} songs</Text>
        </View>
        <TouchableOpacity style={{ padding: 8 }} onPress={addMoreSongs}>
          <Text style={{ color: 'lightgreen', fontSize: 12 }}>Add songs</Text>
        </TouchableOpacity>
      </View>


      <View style={[styles.musicContainer, { backgroundColor: bgTheme }]}>
        {favSongs.length > 0 ? (
          <FlatList
            data={favSongs}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />

        ) : (

          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <View style={{ backgroundColor: '#E82255', padding: 10, borderRadius: 50 }}>
              <FontAwesomeIcon icon={faMusic} size={30} color='white' />
            </View>
            <Text>No songs</Text>
            <TouchableOpacity style={{ color: '#E82255' }} onPress={addMoreSongs}>
              <Text style={{ color: '#E82255' }}>Add Songs</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={openRemovefromFav}
        onRequestClose={() => {
          setopenRemovefromFav(!openRemovefromFav);
        }}

      >
        <Pressable
          style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onPress={() => setopenRemovefromFav(false)}
        >
          <TouchableWithoutFeedback >
            <View style={{
              backgroundColor: isDarkMode ? '#212121' : 'white',
              padding: 20,
              borderRadius: 30,
              width: '92%',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              margin: 10


            }}  >
              <View>
                <View style={{ backgroundColor: '#999', width: 40, borderRadius: 5, height: 5, alignSelf: 'center', marginBottom: 20 }}></View>
                <View style={{ flexDirection: 'column', gap: 15 }} >
                  <TouchableOpacity style={{ flexDirection: 'row', gap: 15, justifyContent: 'center', alignItems: 'center', padding: 15 }} onPress={removeFromfav}>
                    <Text style={{ color: '#E82255', fontSize: 16, }}>Remove from favourite</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ flexDirection: 'row', gap: 15, justifyContent: 'center', alignItems: 'center', padding: 15 }} onPress={() => setopenRemovefromFav(false)}>
                    <Text style={{ color: 'lightgreen', fontSize: 14 }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Pressable>
      </Modal>
    </View >

  )

}

const styles = StyleSheet.create({
  frequentlyUsedContainer: {
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10
  },
  musicContainer: {
    flex: 1,
    marginBottom: 55,

  },
  musicIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 25,
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'

  }

});

export default FavSongs;

