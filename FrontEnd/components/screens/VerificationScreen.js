import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const VerificationScreen = ({ route, navigation }) => {
  const { email, verificationToken } = route.params;
  const [enteredToken, setEnteredToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = () => {
    if (enteredToken === verificationToken) {
      // Verification successful, navigate to success screen or main app screen
      navigation.navigate('Login');
    } else {
      setErrorMessage('Invalid verification code. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Email</Text>
      <Text>Please enter the verification code sent to {email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        onChangeText={setEnteredToken}
        value={enteredToken}
      />
      <Button title="Verify" onPress={handleVerify} />
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
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
});

