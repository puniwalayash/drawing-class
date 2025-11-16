import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '@/types';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Check if user is admin and initialize if needed
  const isAdmin = await checkAndInitializeAdmin(user);

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isAdmin,
  };
};

export const signOut = async () => {
  await firebaseSignOut(auth);
};

export const checkAndInitializeAdmin = async (user: FirebaseUser): Promise<boolean> => {
  const email = user.email?.toLowerCase();
  if (!email) return false;

  // Check if any roles exist
  const rolesRef = collection(db, 'roles');
  const rolesSnapshot = await getDocs(rolesRef);

  // If no roles exist and this is the initial admin email, create the role
  const initialAdminEmail = process.env.NEXT_PUBLIC_INITIAL_ADMIN_EMAIL?.toLowerCase();

  if (rolesSnapshot.empty && email === initialAdminEmail) {
    const roleRef = doc(db, 'roles', user.uid);
    await setDoc(roleRef, {
      email,
      role: 'admin',
      addedBy: 'system',
      createdAt: Timestamp.now(),
    });
    return true;
  }

  // Check if user has admin role
  const q = query(rolesRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};

export const isUserAdmin = async (email: string | null): Promise<boolean> => {
  if (!email) return false;

  const rolesRef = collection(db, 'roles');
  const q = query(rolesRef, where('email', '==', email.toLowerCase()));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const isAdmin = await isUserAdmin(firebaseUser.email);
      callback({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        isAdmin,
      });
    } else {
      callback(null);
    }
  });
};
