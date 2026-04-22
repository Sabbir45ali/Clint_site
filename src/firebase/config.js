import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// This is a placeholder configuration.
// Replace with the actual Firebase config before deployment.
const firebaseConfig = {
  apiKey: "AIzaSy_MOCK_KEY_REPLACE_ME",
  authDomain: "beauty-parlour-mock.firebaseapp.com",
  projectId: "beauty-parlour-mock",
  storageBucket: "beauty-parlour-mock.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:mock123"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
