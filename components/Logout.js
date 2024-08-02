import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../store copy/Actions/authActions';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Logout = ({navigation}) => {
    const dispatch = useDispatch();

    const signOut = async () => {
        try {
          await GoogleSignin.signOut();
          console.log('User signed out');
        } catch (error) {
          console.error('Error signing out:', error);
        }
      };


    useEffect(()=>{
        dispatch(logout());
        signOut();
        navigation.navigate('Home');
    },[])
    return (
        <View>
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default Logout;
