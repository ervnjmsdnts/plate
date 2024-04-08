import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { clientConfig } from './config';

// Initialize Firebase
const app = initializeApp(clientConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
