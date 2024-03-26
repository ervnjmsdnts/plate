import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCMgDhN2EdQt5Qub4ogmeWg0i75mrUQEdg',
  authDomain: 'vmos-73add.firebaseapp.com',
  databaseURL: 'https://vmos-73add-default-rtdb.firebaseio.com',
  projectId: 'vmos-73add',
  storageBucket: 'vmos-73add.appspot.com',
  messagingSenderId: '1013192279010',
  appId: '1:1013192279010:web:acb579d4e17d0d98b7efbb',
  measurementId: 'G-ZJ96CTRBNP',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
