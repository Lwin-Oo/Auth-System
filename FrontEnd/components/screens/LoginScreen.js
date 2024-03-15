import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    // First, check if the user exists
    axios.get(`http://localhost:3000/api/auth/user/${email}`)
      .then(response => {
        // If user exists, attempt login
        const user = response.data;
        if (user) {
          // Compare the provided password with the hashed password stored in the database
          axios.post('http://localhost:3000/api/auth/login', { email, password })
            .then(response => {
              const { token } = response.data;
              console.log('Login successful:', token);
              // Optionally, navigate to another screen upon successful login
              // navigation.navigate('Home');
            })
            .catch(error => {
              // Handle login error
              console.error('Login failed:', error);
              // Display an error message to the user
              setErrorMessage('Incorrect email or password. Please try again.');
            });
        } else {
          console.log('User does not exist');
          // Display a message to the user indicating that the user does not exist
          setErrorMessage('User does not exist. Please register first.');
        }
      })
      .catch(error => {
        // Handle error if unable to check user existence
        console.error('Error checking user existence:', error);
        // Display an error message to the user
        setErrorMessage('An error occurred. Please try again later.');
      });
  };
  
  
  

  const handleRegister = () => {
    // Navigate to RegisterScreen
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Login </Text>
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
      <Button title="Login" onPress={handleLogin}/>
      <Button title="Register" onPress={handleRegister}/>
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
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
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
});

export default LoginScreen;



