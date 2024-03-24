import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Notification = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0078d4',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  message: {
    color: 'white',
    fontSize: 16,
  },
});

export default Notification;
