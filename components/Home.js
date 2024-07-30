import React from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';

const Home = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                WELCOME TO TODOS APP
            </Text>
            <Text style={styles.subtitle}>
                MANAGE YOUR TASKS AT YOUR FINGERTIPS!
            </Text>
            {/* <Image 
                source={{uri: }}
            /> */}
            <View style={styles.buttonContainer}>
                <Button 
                    title='Login' 
                    onPress={() => navigation.navigate('Login')} 
                    
                />
                <Button 
                    title='Signup' 
                    onPress={() => navigation.navigate('Signup')} 
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 20,
    },
   
});

export default Home;


