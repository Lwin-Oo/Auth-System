import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo vector-icons library
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [businessName, setBusinessName] = useState('');
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null); // Define errorMessage state variable
  const [showPassword, setShowPassword] = useState(false); // Define showPassword state variable
  const [verificationToken, setVerificationToken] = useState('');

  // Function to evaluate password strength
  const evaluatePasswordStrength = () => {
    // Define criteria for password strength evaluation
    const criteria = [
      {
        label: 'At least 8 characters',
        isValid: password.length >= 8,
      },
      {
        label: 'Contains uppercase letter',
        isValid: /[A-Z]/.test(password),
      },
      {
        label: 'Contains lowercase letter',
        isValid: /[a-z]/.test(password),
      },
      {
        label: 'Contains number',
        isValid: /\d/.test(password),
      },
      {
        label: 'Contains special character (% or @)',
        isValid: /[%@]/.test(password),
      },
    ];

    // Calculate the strength percentage based on the number of fulfilled criteria
    const fulfilledCriteria = criteria.filter(criterion => criterion.isValid);
    const strengthPercentage = (fulfilledCriteria.length / criteria.length) * 100;

    return { strengthPercentage, missingCriteria: criteria.filter(criterion => !criterion.isValid) };
  };

  // Function to render password strength indicator
  const renderPasswordStrengthIndicator = () => {
    const { strengthPercentage } = evaluatePasswordStrength();

    let color;
    if (strengthPercentage < 26) {
      color = 'red';
    } else if (strengthPercentage < 71) {
      color = 'orange';
    } else {
      color = 'green';
    }

    return (
      <View style={[styles.strengthIndicator, { backgroundColor: color }]}>
        <View style={[styles.strengthFiller, { width: `${strengthPercentage}%` }]} />
      </View>
    );
  };

 // Update the registration request in the handleRegister function in RegisterScreen.js
 const handleRegister = async () => {
  // Check if passwords match
  if (password !== confirmPassword) {
    setErrorMessage('Passwords do not match');
    return;
  }

  // Define criteria for required fields
  const requiredFields = [
    { label: 'Business Name', value: businessName },
    { label: 'Business Phone Number', value: businessPhoneNumber },
    { label: 'Street Address', value: streetAddress },
    { label: 'City', value: city },
    { label: 'State', value: state },
    { label: 'Postal Code', value: postalCode },
    { label: 'Country', value: country },
  ];

  // Check if all required fields are filled
  const missingFields = requiredFields.filter(field => !field.value);
  if (missingFields.length > 0) {
    const errorMessage = `Please fill in the following fields: ${missingFields.map(field => field.label).join(', ')}`;
    setErrorMessage(errorMessage);
    return;
  }

  const { missingCriteria } = evaluatePasswordStrength();
  if (missingCriteria.length > 0) {
    const errorMessage = `Please meet the following criteria for the password: ${missingCriteria.map(criteria => criteria.label).join(', ')}`;
    setErrorMessage(errorMessage);
    return;
  }

  try {
    // Attempt to register user
    const response = await axios.post('http://localhost:3000/api/auth/register', {
      businessName,
      businessPhoneNumber,

      streetAddress,
      city,
      state,
      postalCode,
      country,
      
      email,
      password,
      confirmPassword,
    });

    const { verificationToken } = response.data;
    setVerificationToken(verificationToken);
    setErrorMessage('Verification email sent. Check your inbox.');

    console.log('Registration successful:', response.data);

    // After successful registration, navigate back to LoginScreen
    navigation.navigate('Login');
  } catch (error) {
    console.error('Registration failed:', error);

    if (error.response && error.response.data && error.response.data.error) {
      setErrorMessage(error.response.data.error);
    } else {
      setErrorMessage('Registration failed. Please try again later.');
    }
  }
};

 const handleVerify = () => {
    navigation.navigate('Verification', { email, verificationToken });
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}> Register </Text>
      <TextInput
        style={styles.input}
        placeholder="Business Name"
        onChangeText={setBusinessName}
        value={businessName}
      />
      <TextInput
        style={styles.input}
        placeholder="Business Phone Number"
        onChangeText={setBusinessPhoneNumber}
        value={businessPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Street Address"
        onChangeText={setStreetAddress}
        value={streetAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        onChangeText={setCity}
        value={city}
      />
      <TextInput
        style={styles.input}
        placeholder="State"
        onChangeText={setState}
        value={state}
      />
      <TextInput
        style={styles.input}
        placeholder="Postal Code"
        onChangeText={setPostalCode}
        value={postalCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Country"
        onChangeText={setCountry}
        value={country}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={!showPassword} // Hide password if showPassword is false
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="black" />
        </TouchableOpacity>
      </View>
      {renderPasswordStrengthIndicator()} {/* Render password strength indicator */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry={!showPassword} // Hide password if showPassword is false
      />
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
  strengthIndicator: {
    width: '100%',
    height: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  strengthFiller: {
    height: '100%',
    borderRadius: 5,
  },
});

export default RegisterScreen;




