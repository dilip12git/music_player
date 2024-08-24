import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, useColorScheme, TouchableOpacity, } from 'react-native';
import { useSelector } from 'react-redux';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
const Artist = ({ navigation }) => {
    const Songs = useSelector((state) => state.allSongsReducer);
    const [songArtist, setsongArtist] = useState([]);
    const [artistCount, setAristCount] = useState(0);
    const isDarkMode = useColorScheme() === 'dark';

    const themeColor = isDarkMode ? Colors.white : Colors.black;
 
    useEffect(() => {
        const artists = [...new Set(Songs.map(song =>
            song.artist
        ))];
        setsongArtist(artists);
        setAristCount(artists.length);
    }, [Songs]);

    const openSelectedArtistSong = (artist) => {
        navigation.navigate('artistBasedSongs', { artistName: artist });
    }
    return (
        <View style={{ flex: 1, backgroundColor: isDarkMode ? Colors.black : Colors.white, paddingLeft: 10, paddingRight: 10 }}>
            <View style={{ marginTop: 5 }}>
                <Text style={{ color: 'grey', padding: 8 }}>{artistCount}  Artist</Text>
            </View>
            <FlatList
                data={songArtist}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => openSelectedArtistSong(item)} style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingLeft: 8,
                        paddingRight: 8,
                        paddingBottom: 15,
                        paddingTop: 15
                    }}>
                        <Text style={{ color: themeColor,textTransform:'capitalize' }}>{item}</Text>
                        <FontAwesomeIcon icon={faAngleRight} size={16} style={{ color: 'grey' }} />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

export default Artist;
