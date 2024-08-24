

import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Album from './Tab_screens/Album';
import Artist from './Tab_screens/Artist';
import All_songs from './Tab_screens/All_songs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import BottomPlayer from './Player/BottomPlayer';
import FavSongs from './Tab_screens/favsongs'
const Tab = createMaterialTopTabNavigator();
import {
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import {
    Colors
} from 'react-native/Libraries/NewAppScreen';
import { faSearch, faPlay } from '@fortawesome/free-solid-svg-icons';

const TabNavigator = ({ navigation }) => {
    const handleSearch = () => {
        navigation.navigate('SearchMusic');
    };
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={{ flex: 1, backgroundColor: isDarkMode ? Colors.black : Colors.white, }}>
            <View style={styles.titleContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{
                        backgroundColor: '#E82255',
                        width: 35,
                        height: 35,
                        borderRadius: 25,
                        padding: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>

                        <FontAwesomeIcon icon={faPlay} size={16} style={{ color: 'white', alignSelf: 'center' }} />
                    </View>
                    <Text style={[styles.titleStyle, { color: isDarkMode ? Colors.white : Colors.black }]}>
                        <Text style={{color:'#e82255',fontWeight:'bold'}}>
                            M
                        </Text>Player</Text>
                </View>
                <TouchableOpacity style={[styles.SearchIconContainer, {}]} onPress={handleSearch}>
                    <FontAwesomeIcon icon={faSearch} size={18} style={{ color: isDarkMode ? Colors.white : Colors.black }} />
                </TouchableOpacity>
            </View>
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: isDarkMode ? Colors.black : Colors.white,
                        elevation: 0,
                        paddingLeft: 15,
                        paddingRight: 10,
                        paddingTop: 30,
                        borderBottomWidth: 1,
                        borderColor: isDarkMode ? Colors.darker : Colors.lighter
                    },
                    tabBarGap: 0,
                    tabBarInactiveTintColor: 'grey',
                    tabBarActiveTintColor: '#E82255',
                    tabBarLabelStyle: styles.tabBarLabel,
                    tabBarItemStyle: { width: 'auto', left: -15 }
                }}
            >
                <Tab.Screen name="Songs" component={All_songs}
                    options={{
                        tabBarIndicatorStyle: styles.tabBarIndicator,
                    }}
                />
                <Tab.Screen name="Artist" component={Artist}
                    options={{
                        tabBarIndicatorStyle: styles.tabBarIndicator,
                    }}
                />
                <Tab.Screen name="Album" component={Album}
                    options={{
                        tabBarIndicatorStyle: styles.tabBarIndicator,
                    }}
                />
                <Tab.Screen name="Favourites" component={FavSongs}
                    options={{
                        tabBarIndicatorStyle: styles.tabBarIndicator,
                    }}
                />

            </Tab.Navigator>
            <BottomPlayer nav={navigation} />

        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        marginTop: 10

    },
    titleStyle: {
        fontSize: 20,
        textAlign: 'left',
        fontWeight: 'bold',

    },
    SearchIconContainer: {
        borderRadius: 50,
        padding: 8
    },
    tabBarIndicator: {
        backgroundColor: 'transparent',

    },
    tabBarLabel: {
        textTransform: 'capitalize',
        fontWeight: 'bold',


    }

});

export default TabNavigator;