import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ArduinoStats from './ArduinoStats'; // Adjust the path if necessary

const FirstPageWithButton = () => {
  const [showStats, setShowStats] = useState(false);

  const handlePress = () => {
    setShowStats(true);
  };

  return (
    <View style={styles.container}>
      {!showStats ? (
        <>
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Press button to show realtime data</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Show Weather Report</Text>
          </TouchableOpacity>
        </>
      ) : (
        <ArduinoStats />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: 'purple',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});

export default FirstPageWithButton;
