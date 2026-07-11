import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Web app config from firebase-applet-config.json
const app = initializeApp({
  apiKey: 'AIzaSyDB0dV81b8orwP3p9B7vOurxumMmxJUVp8',
  authDomain: 'omega-cairn-r2t1j.firebaseapp.com',
  projectId: 'omega-cairn-r2t1j',
  storageBucket: 'omega-cairn-r2t1j.firebasestorage.app',
  messagingSenderId: '128182076131',
  appId: '1:128182076131:web:959efecde15329ba857bd6'
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
