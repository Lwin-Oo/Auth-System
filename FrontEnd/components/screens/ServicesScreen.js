import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ServicesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Services</Text>
      <View style={styles.service}>
        <Text style={styles.serviceTitle}>Invoice System</Text>
        <Text style={styles.serviceDescription}>Manage your invoices efficiently.</Text>
        <Button title="Access Invoice System" onPress={() => console.log('Navigate to Invoice System')} />
      </View>
      <View style={styles.service}>
        <Text style={styles.serviceTitle}>Mailing System</Text>
        <Text style={styles.serviceDescription}>Send and manage emails seamlessly.</Text>
        <Button title="Access Mailing System" onPress={() => console.log('Navigate to Mailing System')} />
      </View>
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
    color: '#0078d4',
  },
  service: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  serviceDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ServicesScreen;
