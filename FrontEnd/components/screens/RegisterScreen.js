// RegisterScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        email,
        password,
        confirmPassword,
      });

      // Assuming your backend responds with some data upon successful registration
      console.log('Registration successful:', response.data);

      // After successful registration, navigate back to LoginScreen
      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle registration error, such as displaying an error message to the user
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Register </Text>
      <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
      />
      <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
      />
      <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry
      />
      <Button title="Register" onPress={handleRegister}/>
    </View>
  );
};

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
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default RegisterScreen;

