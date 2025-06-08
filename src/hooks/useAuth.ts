
import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, githubProvider } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google sign-in...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in successful:', result.user);
      
      // Try to create user document, but don't block navigation if it fails
      try {
        await createUserDocument(result.user);
      } catch (docError: any) {
        console.warn('Failed to create user document (continuing anyway):', docError);
        // Continue with navigation even if document creation fails
      }
      
      navigate('/user');
      return result.user;
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      
      // Provide specific error messages
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error('Domain not authorized. Please add this domain to Firebase authorized domains.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by browser. Please allow popups and try again.');
      } else {
        throw new Error(`Authentication failed: ${error.message}`);
      }
    }
  };

  const signInWithGithub = async () => {
    try {
      console.log('Attempting GitHub sign-in...');
      const result = await signInWithPopup(auth, githubProvider);
      console.log('GitHub sign-in successful:', result.user);
      
      // Try to create user document, but don't block navigation if it fails
      try {
        await createUserDocument(result.user);
      } catch (docError: any) {
        console.warn('Failed to create user document (continuing anyway):', docError);
        // Continue with navigation even if document creation fails
      }
      
      navigate('/user');
      return result.user;
    } catch (error: any) {
      console.error('Error signing in with GitHub:', error);
      
      // Provide specific error messages
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error('Domain not authorized. Please add this domain to Firebase authorized domains.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by browser. Please allow popups and try again.');
      } else {
        throw new Error(`Authentication failed: ${error.message}`);
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const createUserDocument = async (user: User) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    
    try {
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        const { displayName, email, photoURL } = user;
        const createdAt = new Date();
        
        await setDoc(userRef, {
          displayName,
          email,
          photoURL,
          createdAt,
          totalTests: 0,
          bestWPM: 0,
          averageWPM: 0,
          averageAccuracy: 0
        });
        console.log('User document created successfully');
      }
    } catch (error: any) {
      console.error('Error with user document:', error);
      // Re-throw the error so it can be caught by the calling function
      throw error;
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signOut
  };
}
