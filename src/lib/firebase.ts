import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
});

export const auth = getAuth(app);

export interface GoogleProfile {
  name: string;
  email: string;
}

export async function signInWithGoogle(): Promise<GoogleProfile> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const { displayName, email } = result.user;
  if (!email) {
    throw new Error('Google account did not provide an email address.');
  }
  return { name: displayName || email.split('@')[0], email };
}
