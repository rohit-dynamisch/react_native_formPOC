import React from 'react';
import { StyleSheet, View,Text } from 'react-native';
import { useSelector } from 'react-redux';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const DrawerComponent = (props) => {
    const auth = useSelector(state=>state.auth.auth);
    return (
        <DrawerContentScrollView {...props}>
        <View>
          <Text>Hello, {auth.name}!</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      
    );
}

const styles = StyleSheet.create({})

export default DrawerComponent;
