import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import FirstPageWithButton from './Components/FirstPageWithButton';
import ArduinoPreviousStatsData from './Components/ArduinoPreviousStatsData';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Weather Control') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Previous Stats') {
            iconName = focused ? 'time' : 'time-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'purple',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Weather Control" component={FirstPageWithButton} />
      <Tab.Screen name="Previous Stats" component={ArduinoPreviousStatsData} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
