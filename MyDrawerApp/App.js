import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack'; 
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './screens/HomeScreen';
import InputScreen from './screens/InputScreen';
import IdentitasSekolahScreen from './screens/IdentitasSekolahScreen';
import StudentDetailScreen from './screens/StudentDetailScreen';
import Constants from 'expo-constants';

import { LogBox } from 'react-native';

// Ignore all log notifications:
LogBox.ignoreAllLogs();

// Log semua network requests
global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
global.FormData = global.originalFormData || global.FormData;

if (window.__FETCH_SUPPORT__) {
  window.__FETCH_SUPPORT__.blob = false;
} else {
  global.Blob = global.originalBlob || global.Blob;
  global.FileReader = global.originalFileReader || global.FileReader;
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeStack({ apiUrl }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home">
        {props => <HomeScreen {...props} apiUrl={apiUrl} />}
      </Stack.Screen>
      <Stack.Screen name="StudentDetail">
        {props => <StudentDetailScreen {...props} apiUrl={apiUrl} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  const apiUrl = Constants.manifest?.extra?.API_URL || 'https://api.rndyy.biz.id';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home">
            {props => <HomeStack {...props} apiUrl={apiUrl} />}
          </Drawer.Screen>
          <Drawer.Screen name="Input">
            {props => <InputScreen {...props} apiUrl={apiUrl} />}
          </Drawer.Screen>
          <Drawer.Screen name="Identitas Sekolah">
            {props => <IdentitasSekolahScreen {...props} apiUrl={apiUrl} />}
          </Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
