import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PinScreen = ({ navigation }) => {
  const [uniquePin, setUniquePin] = useState('');

  useEffect(() => {
    const fetchPin = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const hashedUserId = hashString(storedUserId); // Hash the user ID
        const generatedPin = hashedUserId.substring(0, 4); // Get the first 4 characters of the hashed value
        setUniquePin(generatedPin);
        await AsyncStorage.setItem('userPin', generatedPin); // Store the generated PIN
      } catch (error) {
        console.error('Error generating unique PIN:', error);
      }
    };
    fetchPin();
  }, []);

  const goToServices = () => {
    navigation.navigate('Our Services');
  };

  // Simple hashing function
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
      <Text style={styles.title}>Unique PIN</Text>
      <Text style={styles.pin}>{uniquePin}</Text>
      <Text style={styles.reminder}>Please keep this PIN secure.</Text>
      <Button title="Go to Services" onPress={goToServices} />
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
  },
  pin: {
    fontSize: 20,
    marginBottom: 20,
  },
  reminder: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default PinScreen;








