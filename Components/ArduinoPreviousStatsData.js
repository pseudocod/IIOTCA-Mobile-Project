import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { ref, onValue, query, limitToLast } from 'firebase/database';
import { database } from '../firebaseConfig'; // Adjust the path if necessary

const screenWidth = Dimensions.get('window').width;

const ArduinoPreviousStatsData = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dbRef = query(ref(database, 'Status'), limitToLast(20));

    const handleData = (snapshot) => {
      try {
        const tempData = [];
        const humData = [];
        const labelData = [];
        const dataLimit = 20; // Limit data to the latest 20 entries
        const allData = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data && data.Temperature !== undefined && data.Humidity !== undefined) {
            allData.push(data);
          }
        });

        // Get the latest 20 entries
        const latestData = allData.slice(-dataLimit);
        latestData.forEach((data, index) => {
          tempData.push(data.Temperature); // Adjust if your key is different
          humData.push(data.Humidity);
          labelData.push((index + 1).toString()); // Use indices as labels
        });

        setTemperatureData(tempData);
        setHumidityData(humData);
        setLabels(labelData);
        setLoading(false);
        setError(null); // Clear any previous errors if successful
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

  const temperatureChartData = {
    labels: labels,
    datasets: [
      {
        data: temperatureData,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red for Temperature
        strokeWidth: 2,
        label: 'Temperature'
      },
    ],
    legend: ['Temperature']
  };

  const humidityChartData = {
    labels: labels,
    datasets: [
      {
        data: humidityData,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue for Humidity
        strokeWidth: 2,
        label: 'Humidity'
      },
    ],
    legend: ['Humidity']
  };

  const chartConfig = {
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
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Previous Stats Data</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {loading ? (
        <Text>Loading data...</Text>
      ) : (
        <>
          <Text style={styles.chartHeader}>Temperature</Text>
          <LineChart
            data={temperatureChartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
          <Text style={styles.chartHeader}>Humidity</Text>
          <LineChart
            data={humidityChartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </>
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
  chartHeader: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default ArduinoPreviousStatsData;
