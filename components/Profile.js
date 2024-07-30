import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useSelector } from 'react-redux';

const Profile = () => {
  const auth = useSelector(state => state.auth.auth);
  
  console.warn(auth.image);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Text style={styles.label}>Profile Image</Text>
        {auth.image ? (
          <Image source={{ uri: auth.image }} style={styles.image} />
        ) : (
          <Text style={styles.error}>No Image Available</Text>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Name - {auth.name}</Text>
        <Text style={styles.infoText}>Email - {auth.email}</Text>
        <Text style={styles.infoText}>DOB - {auth.dob || 'N/A'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoContainer: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default Profile;
