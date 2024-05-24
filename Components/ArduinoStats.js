import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { ref, onValue, update, off } from 'firebase/database';
import { database } from '../firebaseConfig'; // Adjust the path if necessary
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icon library

const getTemperatureIcon = (temperature) => {
  if (temperature < 10) {
    return 'weather-snowy';
  } else if (temperature >= 10 && temperature < 25) {
    return 'weather-partly-cloudy';
  } else {
    return 'weather-sunny';
  }
};

const getTemperatureString = (temperatureIcon) => {
  if (temperatureIcon === 'weather-snowy') {
    return 'It\'s very cold!';
  } else if (temperatureIcon === 'weather-partly-cloudy') {
    return 'It\'s mild!';
  } else if (temperatureIcon === 'weather-sunny') {
    return 'It\'s hot!';
  }
};

const getRainStateIcon = (rainState) => {
  return rainState ? 'weather-rainy' : 'weather-sunny';
};

const getRainStateString = (rainState) => {
  return rainState ? 'It\'s raining!' : 'It\'s not raining!';
};

const ArduinoStats = () => {
  const [sensorData, setSensorData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dbRef = ref(database, '/'); // Reference the root node

    const handleData = (snapshot) => {
      try {
        const data = snapshot.val() || {};
        console.log('Fetched data:', data); // Log the fetched data
        setSensorData(data);
        setLoading(false);
        setError(null); // Clear any previous errors if successful

        // Check for Buzzer State
        if (data['Buzzer State']) {
          Alert.alert(
            'Alert',
            'Weather is getting bad!',
            [
              {
                text: 'OK',
                onPress: () => handleBuzzerStateChange(false),
              }
            ]
          );
        }
      } catch (error) {
        console.error('Error handling data:', error);
        setLoading(false);
        setError(error.message); // Set error state if any error occurs
      }
    };

    const handleError = (error) => {
      console.error('Error fetching data:', error);
      setLoading(false);
      setError(error.message); // Set error state if any error occurs
    };

    console.log('Setting up Firebase listener');
    onValue(dbRef, handleData, handleError);

    // Cleanup function
    return () => {
      console.log('Cleaning up Firebase listener');
      off(dbRef, 'value', handleData);
    };
  }, []);

  const handleBuzzerStateChange = (newState) => {
    const dbRef = ref(database, '/'); // Reference the root or appropriate node
    update(dbRef, { 'Buzzer State': newState })
      .then(() => console.log('Buzzer State updated successfully'))
      .catch((error) => console.error('Error updating Buzzer State:', error));
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const temperature = sensorData['Temperature'];
  const temperatureIcon = getTemperatureIcon(temperature);
  const temperatureString = getTemperatureString(temperatureIcon);
  const rainState = sensorData['Rain State'];
  const rainStateIcon = getRainStateIcon(rainState);
  const rainStateString = getRainStateString(rainState);
  const date = sensorData['Date'];
  const time = sensorData['Time'];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.dataContainer}>
        <Text style={styles.subHeader}>Last update:</Text>
        <Text style={styles.dataText}>Date: {date}</Text>
        <Text style={styles.dataText}>Time: {time}</Text>
        <Text style={styles.subHeader}>Weather Report:</Text>
        <View style={styles.dataRow}>
          <Text style={styles.dataText}>
            {temperatureString} {temperature} °C
          </Text>
          <Icon name={temperatureIcon} size={24} color="#000" style={styles.icon} />
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataText}>{rainStateString}</Text>
          <Icon name={rainStateIcon} size={24} color="#000" style={styles.icon} />
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataText}>Humidity: {sensorData['Humidity']} %</Text>
          <Icon name="water-percent" size={24} color="#000" style={styles.icon} />
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataText}>Altitude: {parseFloat(sensorData['Altitude']).toFixed(2)} Meters</Text>
          <Icon name="altimeter" size={24} color="#000" style={styles.icon} />
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataText}>Pressure: {sensorData['Pressure']} Pa</Text>
          <Icon name="gauge" size={24} color="#000" style={styles.icon} />
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataText}>Sealevel Pressure: {sensorData['Sealevel Pressure']} Pa</Text>
          <Icon name="gauge" size={24} color="#000" style={styles.icon} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subHeader: {
    fontSize: 18,
    textAlign: 'left',
    marginVertical: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  dataContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  dataText: {
    fontSize: 16,
    color: '#555',
    flexShrink: 1,
  },
  icon: {
    marginLeft: 10,
  },
  errorText: {
    fontSize: 16,
    marginVertical: 4,
    color: 'red',
    textAlign: 'center',
  },
});

export default ArduinoStats;
