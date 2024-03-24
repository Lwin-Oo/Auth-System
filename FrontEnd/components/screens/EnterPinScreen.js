import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EnterPinScreen = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    retrieveUserId();
  }, []);

  const retrieveUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
    } catch (error) {
      console.error('Error retrieving user ID:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      // Assuming you have a function to hash the userId and get the PIN
      const hashedUserId = hashString(storedUserId); // Hash the user ID
      const storedPin = hashedUserId.substring(0, 4); // Get the first 4 characters of the hashed value
  
      if (pin === storedPin) {
        // Correct PIN, navigate to the invoice system
        console.log(`User Found: ${storedUserId}`);
      } else {
        // Incorrect PIN, display error message
        console.log('Incorrect PIN');
        // You can display an error message to the user here
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
    }
  };
  
  // Simple hashing function (same as used in PinScreen)
  const hashString = (str) => {
    let hash = 0;
    if (str.length === 0) {
      return hash.toString();
    }
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your PIN</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter PIN"
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        secureTextEntry
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
});

export default EnterPinScreen;



