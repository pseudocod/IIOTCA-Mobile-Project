// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA5aqIff7YGj10C8coHmiw5KRJszTZcZ0E",
  authDomain: "iot-weather-station-a2dc0.firebaseapp.com",
  databaseURL: "https://iot-weather-station-a2dc0-default-rtdb.firebaseio.com",
  projectId: "iot-weather-station-a2dc0",
  storageBucket: "iot-weather-station-a2dc0.appspot.com",
  messagingSenderId: "309680090118",
  appId: "1:309680090118:web:276f43e99143c82e8ce787"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

export { auth, database };
