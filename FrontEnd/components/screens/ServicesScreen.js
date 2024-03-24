import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, Linking } from 'react-native';
import Toast from 'react-native-toast-message';

const ServicesScreen = ({ navigation, route }) => {
  const userId = route?.params?.userId;

  useEffect(() => {
    // Show notification when component mounts
    showLoginNotification();
  }, []); // Empty dependency array ensures it runs only once when component mounts

  // Function to show successful login notification
  const showLoginNotification = () => {
    Toast.show({
      type: 'success',
      text1: 'Login Successful',
      text2: 'You have successfully logged in.',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30,
    });
  };

  // Function to navigate to the Enter Pin Screen
  const navigateToEnterPin = () => {
    navigation.navigate('EnterPinScreen', { userId: userId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Services</Text>
      <View style={styles.service}>
        <Text style={styles.serviceTitle}>Invoice System</Text>
        <Text style={styles.serviceDescription}>Manage your invoices efficiently.</Text>
        <Button title="Access Invoice System" onPress={() => navigateToEnterPin(userId)} />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0078d4',
  },
  service: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  serviceDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ServicesScreen;







