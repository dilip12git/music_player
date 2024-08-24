import React, { useEffect, useRef, useState } from 'react';
import TextTicker from 'react-native-text-ticker';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMusic, faPlay, faForwardStep, faPause } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux'
import { selectedSong, setIsSongPlaying } from '../../redux/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, { } from 'react-native-track-player';
import {
    Animated,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
    Easing
} from 'react-native';
const BottomPlayer = ({ nav }) => {

    const dispatch = useDispatch()
    const Songs = useSelector((state) => state.allSongsReducer);
    const selected = useSelector((state) => state.selectedSongReducer);
    const isSongPlaying = useSelector((state) => state.isSongPlaying);
    //theme 
    const isDarkMode = useColorScheme() === 'dark';
    const themeColor = isDarkMode ? Colors.white : Colors.black;
    const bgTheme = isDarkMode ? Colors.black : Colors.white;
    const dimColorTheme = isDarkMode ? Colors.light : Colors.darker;
    const [isPlayerReady, setPlayerReady] = useState(false);

    const rotateAnim = useRef(new Animated.Value(0)).current;
    const shouldRotate = useRef(false);
    const toggleModal = () => {
        nav.navigate('AudioPlayer');
    };

    useEffect(() => {
        const playSelectedSong = async () => {
            try {
                await TrackPlayer.stop();
                await TrackPlayer.reset();
                if (Songs && Songs.length > 0) {
                    await TrackPlayer.add(Songs);
                    setPlayerReady(true);
                }
            } catch (error) {
                console.error('Failed to play selected song', error);
            }
        };

        const onTrackChange = async () => {
            const ActiveTrack = await TrackPlayer.getActiveTrack();
            storeSelectedSong(ActiveTrack);
            dispatch(selectedSong(ActiveTrack));
        };

        const subscription = TrackPlayer.addEventListener('playback-track-changed', onTrackChange);
        playSelectedSong();

        return () => {
            TrackPlayer.stop();
            subscription.remove();
        };
    }, [Songs]);

    useEffect(() => {
        if (isPlayerReady && selected !== null) {
            const index = Songs.findIndex(item => item.url === selected.url);
            if (index !== -1) {
                TrackPlayer.skip(index);
            }
        }
    }, [isPlayerReady, selected, Songs]);


    const handleNextSong = async () => {
        await TrackPlayer.skipToNext();
        await TrackPlayer.play();
        dispatch(setIsSongPlaying(true));
    };



    const playPause = async () => {
        if (selected && isSongPlaying === true) {
            await TrackPlayer.pause();
            dispatch(setIsSongPlaying(false));

        }
        else {
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
    useEffect(() => {
        shouldRotate.current = isSongPlaying;
        const rotate = () => {
            if (shouldRotate.current) {
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }).start(({ finished }) => {
                    if (finished && shouldRotate.current) {
                        rotateAnim.setValue(0);
                        rotate();
                    }
                });
            }
        };

        rotate();
    }, [isSongPlaying, rotateAnim]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <SafeAreaView style={{}}>
            <View style={[styles.bottomPlayer, { backgroundColor: bgTheme, borderColor: isDarkMode ? Colors.darker : Colors.lighter }]}>
                <TouchableOpacity style={{ flexDirection: 'row', gap: 10, alignItems: 'center', width: 160 }} onPress={toggleModal}>
                    <Animated.View style={[styles.rotateMusicIconContainer, { backgroundColor: '#E82255', transform: [{ rotate: spin }] }]}>
                        <FontAwesomeIcon icon={faMusic} size={18} color='white' />
                    </Animated.View>
                    {selected !== null ? (
                        <View>
                            <TextTicker numberOfLines={1} style={[styles.songName, { color: themeColor }]} ellipsizeMode="tail" scrollSpeed={50}>
                                {selected.title}
                            </TextTicker>
                            <Text style={[, { color: dimColorTheme, fontSize: 10 }]}>{selected.artist}</Text>
                        </View>
                    ) : (
                        <Text>No music item selected</Text>

                    )}

                </TouchableOpacity>
                <View style={{ flexDirection: 'row', gap: 4, alignItems: 'flex-end', marginRight: -20 }}>
                    <TouchableOpacity onPress={() => playPause()} style={styles.controls}>
                        <FontAwesomeIcon icon={isSongPlaying === true ? faPause : faPlay} size={20} style={{ color: dimColorTheme, alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNextSong} style={styles.controls}>
                        <FontAwesomeIcon icon={faForwardStep} size={20} style={{ color: dimColorTheme }} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    bottomPlayer: {
        flex: 1,
        paddingLeft: 13, paddingRight: 22, padding: 10,
        width: '100%', height: 60, position: 'absolute', bottom: 0, flexDirection: 'row',
        gap: 10, justifyContent: 'space-between', alignItems: 'center', borderTopColor: '#E82255',
        borderTopWidth: 1,

    },
    rotateMusicIconContainer: {
        width: 35,
        height: 35,
        borderRadius: 25,
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },

    controls: {
        borderRadius: 25,
        width: 50,
        height: 50,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default BottomPlayer;