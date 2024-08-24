
import React, { useEffect, createContext, } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { DefaultTheme, DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import TabNavigator from './src/components/tab';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PermissionsAndroid,
  StatusBar,
  View,
  useColorScheme,
} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { setAllSongs } from './src/redux/action';
import { getAll } from 'react-native-get-music-files';
import { useDispatch } from 'react-redux'
import FavouritesSongs from './src/components/Tab_screens/favsongs';
import AddToFavourites from './src/components/Audio_screens/AddToFavourite';
import SearchMusic from './src/components/Audio_screens/AudioSearch';
import AudioPlayer from './src/components/Player/AudioPlayer';
import ArtisBasedSongs from './src/components/Audio_screens/artistBasedSongs';
import AlbumSongs from './src/components/Audio_screens/albumSong';

const Stack = createStackNavigator();
export const AppContext = createContext();
const App = () => {

  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? DarkTheme : DefaultTheme;

  const dispatch = useDispatch()
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  })


  useEffect(() => {
    const initializePlayer = async () => {
      try {
      await TrackPlayer.setupPlayer();
      } catch (error) {
        console.error('Failed to initialize TrackPlayer', error);
      }
    };

    const initializeFavSongs = async () => {
      try {
        const existingSongs = await AsyncStorage.getItem('favSongs');
        if (!existingSongs) {
          await AsyncStorage.setItem('favSongs', JSON.stringify([]));
        }
      } catch (e) {
        console.error('Failed to initialize favSongs:', e);
      }
    };
    initializeFavSongs()
    initializePlayer();

    return () => {
      TrackPlayer.stop();
    };
  }, []);


  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const grantedStorage = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'Your app needs access to storage to store audio and video files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        const grantedWriteStorage = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'Your app needs access to storage to store audio and video files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (
          grantedStorage === PermissionsAndroid.RESULTS.GRANTED &&
          grantedWriteStorage === PermissionsAndroid.RESULTS.GRANTED

        ) {
          fetechAllSongs();
        } else {
          requestPermissions();
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestPermissions();
  }, []);

  const fetechAllSongs = async () => {
    await getAll({
    })
      .then((filesOrError) => {
        if (typeof filesOrError === 'string') {
          console.error(filesOrError);
          return;
        }
        const reversedFiles = filesOrError.reverse();
        dispatch(setAllSongs(reversedFiles));
      })
      .catch((error) => {
        console.error(error);
      });

  }



  return (
    <AppContext.Provider value={{ fetechAllSongs }}>
      <View style={{ flex: 1, }}>
        <StatusBar translucent backgroundColor="transparent"
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />

        <NavigationContainer theme={theme}>
          <Stack.Navigator>
            <Stack.Screen
              name="Tabs"
              component={TabNavigator}
              options={{
                headerShown: false,

              }}

            />
            <Stack.Screen
              name="Favourites"
              component={FavouritesSongs}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <Stack.Screen
              name="AddToFavourites"
              component={AddToFavourites}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <Stack.Screen
              name="SearchMusic"
              component={SearchMusic}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <Stack.Screen
              name="AudioPlayer"
              component={AudioPlayer}
              options={{
                headerShown: false,
                ...TransitionPresets.ModalSlideFromBottomIOS,
              }}
            />
            <Stack.Screen
              name="artistBasedSongs"
              component={ArtisBasedSongs}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
         
          <Stack.Screen
              name="albumbasesongs"
              component={AlbumSongs}
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </AppContext.Provider>
  );
};

export default App;
