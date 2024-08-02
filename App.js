/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component, useEffect } from "react";
// import type { Node } from "react";

import {
  Alert,
  Button,
  PermissionsAndroid,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import {
  Colors
} from "react-native/Libraries/NewAppScreen";

import Signup from "./components/Signup";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./components/Login";
import Home from "./components/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Todo from "./components/Todo";
import { Provider } from "react-redux";
import store, { persistor } from './store copy';
import DrawerNavigator from "./components/Drawer";
import Profile from "./components/Profile";
import { PersistGate } from "redux-persist/integration/react";
import messaging from '@react-native-firebase/messaging';
import FirebaseTodo from "./components/FirebaseTodo";
import AsyncStorage from "@react-native-async-storage/async-storage";
// PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}


const getFcmToken = async()=>{
  let fcmToken=  await AsyncStorage.getItem('fcmToken')
  console.log("OLD TOKEN",fcmToken);
  if(!fcmToken) {
    try{
      const fcmToken = await messaging().getToken();
      if(fcmToken){
        console.log("NEW TOKEN",fcmToken);
        await AsyncStorage.setItem('fcmToken',fcmToken);
        
      }
      
    }
    catch(err){
      console.log(err);
    }
  }
}

const Stack = createNativeStackNavigator();
const App = () => {
  const isDarkMode = useColorScheme() === "dark";
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  useEffect(()=>{
    requestUserPermission();

    messaging().getInitialNotification().then(async (remoteMessage)=>{
      if(remoteMessage) console.log("Notification caused app to open from quite state",remoteMessage.notification);
    })

    messaging().onNotificationOpenedApp((remoteMessage)=>{
      console.log("Notification caused app to open from background state ",remoteMessage.notification);
    })

    messaging().setBackgroundMessageHandler(async (remoteMessage)=>{
      console.log("Message handled in background!",remoteMessage);
    })

    const unsub = messaging().onMessage(async (remoteMessage)=>{
      Alert.alert("NOTIFICATION",JSON.stringify(remoteMessage))
    })
    return unsub;
  },[])

  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Todo" component={FirebaseTodo} />
            {/* <Stack.Screen name="Todo" component={Todo} /> */}
            <Stack.Screen name="Drawer" component={DrawerNavigator} />
            <Stack.Screen name="Logout" component={Login} />
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
        </NavigationContainer>
        </PersistGate>
        </Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;