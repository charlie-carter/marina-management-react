// authService.ts
import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

export const signInWithEmail = async (email: string, password: string) => {
    await setPersistence(auth, browserLocalPersistence);
    return signInWithEmailAndPassword(auth, email, password);
};
