import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../store copy/Actions/authActions';

const Logout = ({navigation}) => {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(logout());
        navigation.navigate('Home');
    },[])
    return (
        <View>
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default Logout;
