// LoginScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedPin, setGeneratedPin] = useState('');

  const generatePin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000 );
    setGeneratedPin(pin.toString());
  };
  
  const handleLogin = async () => {
    try {
      const loginResponse = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      const { token } = loginResponse.data;
  
      // Parse the token to extract user ID
      const decodedToken = token.split('.')[1];
      const base64 = decodedToken.replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = JSON.parse(atob(base64));
      const userId = decodedData.userId;
  
      console.log('Login successful. User ID:', userId);
      await AsyncStorage.setItem('userId', userId);
      console.log('User ID stored in AsyncStorage', userId);
  
      // Generate PIN and navigate to PinScreen
      generatePin();
      navigation.navigate('PinScreen', { generatedPin });
  
      // Show toast notification after navigation
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome to the services page!',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
        onShow: () => {},
        onHide: () => {},
        onPress: () => {}
      });
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };
  
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword'); // Navigate to the ForgotPassword screen
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>New user? Register here</Text>
      </TouchableOpacity>
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#0078d4',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#0078d4',
    fontSize: 16,
  },
  registerButton: {
    marginTop: 20,
  },
  registerButtonText: {
    color: '#0078d4',
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
});

export default LoginScreen;







