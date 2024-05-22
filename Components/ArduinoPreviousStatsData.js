import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import database from '../firebaseConfig'; // Adjust the path if necessary

const screenWidth = Dimensions.get('window').width;

const ArduinoPreviousStatsData = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const dbRef = ref(database, 'Status');
    onValue(dbRef, (snapshot) => {
      const tempData = [];
      const humData = [];
      const labelData = [];
      const dataLimit = 10; // Limit data to the latest 10 entries
      const allData = [];
      snapshot.forEach((childSnapshot) => {
        allData.push(childSnapshot.val());
      });

      // Get the latest 10 entries
      const latestData = allData.slice(-dataLimit);
      latestData.forEach((data, index) => {
        tempData.push(data.Temperature); // Adjust if your key is different
        humData.push(data.Humidity);
        labelData.push((allData.length - dataLimit + index).toString()); // Use indices as labels
      });

      setTemperatureData(tempData);
      setHumidityData(humData);
      setLabels(labelData);
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Previous Stats Data</Text>
      {(temperatureData.length > 0 && humidityData.length > 0) ? (
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: temperatureData,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red for Temperature
                strokeWidth: 2,
                label: 'Temperature'
              },
              {
                data: humidityData,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue for Humidity
                strokeWidth: 2,
                label: 'Humidity'
              }
            ],
            legend: ['Temperature', 'Humidity']
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      ) : (
        <Text>Loading data...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ArduinoPreviousStatsData;
