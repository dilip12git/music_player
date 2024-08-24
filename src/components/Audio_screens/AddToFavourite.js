import React, { useEffect, useState, useContext } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View,
    useColorScheme,
    TextInput,
    StatusBar
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faMusic,
    faArrowLeft,
    faSearch,
} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setFavouritesSongs } from '../../redux/action';
import { useDispatch, useSelector } from 'react-redux'
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

const AddToFavourites = (props) => {
    const isDarkMode = useColorScheme() === 'dark';
    const dispatch = useDispatch()
    const Songs = useSelector((state) => state.allSongsReducer);
    const favSongs = useSelector((state) => state.favSongsReducer);

    const [searchQuery, setSearchQuery] = useState('');
    const themeColor = isDarkMode ? Colors.white : Colors.black;
    const dimColorTheme = isDarkMode ? Colors.light : Colors.darker;
    const darkTheme = isDarkMode ? Colors.darker : Colors.lighter;
    const [allFavSongs, setAllFavSong] = useState([]);
    const [allSongs, setfilterSongs] = useState([]);


    useEffect(() => {
        setAllFavSong(favSongs);
    }, [favSongs])
    useEffect(() => {
        setfilterSongs(Songs);
    }, [Songs])


    const addFavSongItem = async (favSong) => {
        try {
            if (!favSong || !favSong.url) {
                console.error('Invalid song object:', favSong);
                return;
            }
            let favSongsArray = [];
            const existingSongs = await AsyncStorage.getItem('favSongs');

            if (existingSongs !== null) {
                favSongsArray = JSON.parse(existingSongs);
                const existingIndex = favSongsArray.findIndex(item => item.url === favSong.url);
                if (existingIndex !== -1) {
                    favSongsArray.splice(existingIndex, 1);
                    setFavSong(false);
                    await AsyncStorage.setItem('favSongs', JSON.stringify(favSongsArray));
                    ToastAndroid.show('Removed from favourites.', ToastAndroid.SHORT);
                }
                else {
                    favSongsArray.push(favSong);
                    setFavSong(true);
                    await AsyncStorage.setItem('favSongs', JSON.stringify(favSongsArray));
                    ToastAndroid.show('Song added to favourites.', ToastAndroid.SHORT);


                }
            } else {
                favSongsArray.push(favSong);
                setFavSong(true);
                await AsyncStorage.setItem('favSongs', JSON.stringify(favSongsArray));
                ToastAndroid.show('Song added to favourites.', ToastAndroid.SHORT);
            }

            dispatch(setFavouritesSongs(favSongsArray));

        } catch (e) {
            console.error('Failed to add item to array:', e);
        }
    };

    const goBack = () => {
        props.navigation.goBack();
    };
    const handleSearch = (text) => {
        setSearchQuery(text);
        // Perform search logic here
        const filteredSongs = Songs.filter((song) =>
            song.title.toLowerCase().includes(text.toLowerCase()) ||
            song.artist.toLowerCase().includes(text.toLowerCase()) ||
            song.album.toLowerCase().includes(text.toLowerCase())
        );
        setfilterSongs(filteredSongs)
    };
    const renderItem = ({ item }) => {
        const isFav = allFavSongs.some(fav => fav.url === item.url);
        return (
            <View style={{ marginTop: 4, marginBottom: 15, paddingLeft: 5, paddingRight: 5 }}>
                <View style={[, { flexDirection: 'row', gap: 5, padding: 8, alignItems: 'center', justifyContent: 'space-between' }]}>
                    <TouchableOpacity onPress={() => addFavSongItem(item)}
                        style={{ flexDirection: 'row', gap: 10, alignItems: 'center', flex: 1 }}

                    >
                        <View style={[styles.musicIconContainer, { backgroundColor: '#E82255' }]}>
                            <FontAwesomeIcon icon={faMusic} size={18} color={'white'} />
                        </View>
                        <View style={{ flexDirection: 'column', gap: 5, alignContent: 'center', width: 220 }}>
                            <Text style={[styles.songName, { color: themeColor }]} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                            <View style={[styles.songInfo, { flexDirection: 'row', gap: 4, alignItems: 'center' }]}>
                                <Text style={{ color: dimColorTheme, fontSize: 10 }}>{item.artist}</Text>
                                <Text style={{ color: dimColorTheme, fontSize: 10 }}>-</Text>
                                <Text style={{ color: dimColorTheme, fontSize: 10 }}>{item.album}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {isFav ?
                        <TouchableOpacity onPress={() => addFavSongItem(item)} style={{ padding:10 }}>
                            <FontAwesomeIcon icon={solidHeart} size={20} style={{ color: '#e82255', paddingLeft:5 }} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => addFavSongItem(item)} style={{ padding:10}}>
                            <FontAwesomeIcon icon={regularHeart} size={20} style={{ color:themeColor, paddingLeft: 5 }} />
                        </TouchableOpacity>
                    }
                </View>


            </View>
        );
    };

    return (

        <SafeAreaView>
            <View style={{ backgroundColor: isDarkMode ? Colors.black : Colors.white, width: '100%', height: '100%' }}>
                <View style={[styles.toolBar, { borderColor: isDarkMode ? Colors.darker : Colors.lighter }]}>
                    <TouchableOpacity onPress={goBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 20, }}>
                        <FontAwesomeIcon icon={faArrowLeft} size={20} style={{ color: themeColor }} />
                    </TouchableOpacity>
                    <Text style={{ color: themeColor, fontSize: 16, fontWeight: 'bold' }}>Add Songs</Text>
                </View>
                <View style={[styles.searchContainer, {
                    backgroundColor: darkTheme, color: themeColor
                }]}>
                    <FontAwesomeIcon icon={faSearch} size={16} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { backgroundColor: "transparent" }]}
                        placeholder="Search song, artist, album"
                        placeholderTextColor="#999"
                        onChangeText={handleSearch}
                        value={searchQuery}
                        cursorColor={'#E82255'}
                    />
                </View>

                <FlatList
                    data={allSongs}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                />
            </View>

        </SafeAreaView>

    )



}
const styles = StyleSheet.create({
    searchContainer: {
        marginLeft: 15,
        marginRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        padding: 3,
        marginTop: 15,
        marginBottom: 10

    },
    searchIcon: {
        marginRight: 5,
    },
    searchInput: {
        height: 40,
        borderRadius: 10

    },
    toolBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        marginTop:10,
        paddingLeft: 8,
        gap: 15
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
    },
});

export default AddToFavourites;