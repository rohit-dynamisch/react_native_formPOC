import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Todo from './Todo';
import Login from './Login';
import React from 'react';
import Logout from './Logout';
import { useSelector } from 'react-redux';
import { Text, View } from 'react-native';
import DrawerComponent from './DrawerComponent';
import Profile from './Profile';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const auth=useSelector(state=>state.auth.auth);
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerComponent {...props}/>}>
      <Drawer.Screen name="Todo" component={Todo} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Logout" component={Logout} />
    </Drawer.Navigator>

  );
}
