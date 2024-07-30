/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from "react";
import type { Node } from "react";

import {
  Button,
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
const Stack = createNativeStackNavigator();
const App = () => {
  const isDarkMode = useColorScheme() === "dark";
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  

  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Todo" component={Todo} />
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