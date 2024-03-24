import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './constants/AuthContext';
import LoginScreen from './components/screens/LoginScreen';
import RegisterScreen from './components/screens/RegisterScreen';
import ServicesScreen from './components/screens/ServicesScreen';
import ForgotPasswordScreen from './components/screens/ForgotPasswordScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import PinScreen from './components/screens/PinScreen';
import EnterPinScreen from './components/screens/EnterPinScreen';

const Stack = createStackNavigator();

const App = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userIdFromStorage = await AsyncStorage.getItem('userId');
      setUserId(userIdFromStorage);
    };
    fetchUserId();
  }, []);

  return (
    <AuthProvider userId={userId}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="PinScreen" component={PinScreen} />
          <Stack.Screen 
            name="Our Services" 
            options={{ headerShown: false }} 
            children={(props) => <ServicesScreen {...props} userId={userId} />} // Pass navigation prop to ServicesScreen
          />
          <Stack.Screen name="EnterPinScreen" component={EnterPinScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </AuthProvider>
  );
};

export default App;




