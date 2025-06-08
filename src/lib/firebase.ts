
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDPi-N4KxtWNXQEpeeUz6TWpwbBChpMfZc",
  authDomain: "type-tmtr.firebaseapp.com",
  projectId: "type-tmtr",
  storageBucket: "type-tmtr.firebasestorage.app",
  messagingSenderId: "611600038202",
  appId: "1:611600038202:web:96bd4fd6c0f287368b7803",
  measurementId: "G-4CYBEJNM3Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
