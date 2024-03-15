import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo vector-icons library

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null); // Define errorMessage state variable
  const [showPassword, setShowPassword] = useState(false); // Define showPassword state variable

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
    ];

    // Calculate the strength percentage based on the number of fulfilled criteria
    const strengthPercentage = (criteria.filter(criterion => criterion.isValid).length / criteria.length) * 100;

    return strengthPercentage;
  };

  // Function to render password strength indicator
  const renderPasswordStrengthIndicator = () => {
    const strengthPercentage = evaluatePasswordStrength();

    return (
      <View style={styles.strengthIndicator}>
        <View style={[styles.strengthFiller, { width: `${strengthPercentage}%` }]} />
      </View>
    );
  };

  const handleRegister = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

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
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Registration failed. Please try again later.');
      }
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry={!showPassword} // Hide password if showPassword is false
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="black" />
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  strengthFiller: {
    height: '100%',
    backgroundColor: 'green', // Change color based on password strength
    borderRadius: 5,
  },
});

export default RegisterScreen;


