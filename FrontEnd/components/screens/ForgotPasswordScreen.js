// ForgotPasswordScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [totp, setTotp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [step, setStep] = useState(1);

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/forgot-password', { email });
      setQrCodeUrl(response.data.qrCodeUrl);
      setStep(2); // Move to the next step
      setErrorMessage('');
    } catch (error) {
      console.error('Forgot password failed:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
      setSuccessMessage('');
    }
  };

  const handleVerifyTotp = async () => {
    try {
      console.log(`Sending TOTP verification request with email: ${email}, token: ${totp}, newPassword: ${newPassword}`);
      const response = await axios.post('http://localhost:3000/api/auth/verify-reset-token', { email, token: totp, newPassword });
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      setStep(3); // Move to the success step
    } catch (error) {
      console.error('Verify TOTP failed:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
      setSuccessMessage('');
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login'); // Navigate back to the Login screen
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <>
          <Text style={styles.title}>Forgot Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Button title="Reset Password" onPress={handleForgotPassword} />
          <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
        </>
      )}
      {step === 2 && (
        <>
          <Text style={styles.title}>Scan QR Code</Text>
          {qrCodeUrl ? <Image source={{ uri: qrCodeUrl }} style={styles.qrCode} /> : null}
          <TextInput
            style={styles.input}
            placeholder="TOTP"
            onChangeText={setTotp}
            value={totp}
            autoCapitalize="none"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            onChangeText={setNewPassword}
            value={newPassword}
            secureTextEntry
          />
          <Button title="Verify and Reset Password" onPress={handleVerifyTotp} />
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
        </>
      )}
      {step === 3 && (
        <>
          <Text style={styles.title}>Password Reset Successful</Text>
          <Text style={styles.successMessage}>{successMessage}</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </>
      )}
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
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#0078d4',
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
  successMessage: {
    color: 'green',
    marginTop: 20,
    fontSize: 16,
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default ForgotPasswordScreen;
