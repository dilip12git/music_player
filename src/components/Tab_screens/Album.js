import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, useColorScheme, TouchableOpacity, } from 'react-native';
import { useSelector } from 'react-redux';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleRight, faFolder } from '@fortawesome/free-solid-svg-icons';
const Album = ({ navigation }) => {
    const Songs = useSelector((state) => state.allSongsReducer);
    const [albumSong, setalbumSong] = useState([]);
    const [albumCount, setalbumCount] = useState(0);
    const isDarkMode = useColorScheme() === 'dark';

    const themeColor = isDarkMode ? Colors.white : Colors.black;
    useEffect(() => {
        const albums = [...new Set(Songs.map(song =>
            song.album
        ))];
        setalbumSong(albums);
        setalbumCount(albums.length);
    }, [Songs]);

    const openSelectedAlbumSong = (album) => {
        navigation.navigate('albumbasesongs', { albumName: album });
    }
    return (
        <View style={{ flex: 1, backgroundColor: isDarkMode ? Colors.black : Colors.white, paddingLeft: 10, paddingRight: 10 }}>
            <View style={{ marginTop: 5 }}>
                <Text style={{ color: 'grey', padding: 8 }}>{albumCount}  Folder</Text>
            </View>
            <FlatList
                data={albumSong}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => openSelectedAlbumSong(item)} style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingLeft: 8,
                        paddingRight: 8,
                        paddingBottom: 20,
                        paddingTop: 15
                    }}>
                        <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap:10
                    }}
                        >
                        <FontAwesomeIcon icon={faFolder} size={18} style={{ color: 'lightgreen' }} />
                        <Text style={{ color: themeColor, textTransform: 'capitalize' }}>{item}</Text>
                        </View>
                        <FontAwesomeIcon icon={faAngleRight} size={16} style={{ color: 'grey' }} />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

export default Album;
