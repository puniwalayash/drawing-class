import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Role } from '@/types';

export const addAdminRole = async (email: string, addedBy: string): Promise<string> => {
  const normalizedEmail = email.toLowerCase();

  // Check if role already exists
  const q = query(collection(db, 'roles'), where('email', '==', normalizedEmail));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    throw new Error('Admin role already exists for this email');
  }

  const roleData: Omit<Role, 'id'> = {
    email: normalizedEmail,
    role: 'admin',
    addedBy,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'roles'), roleData);
  return docRef.id;
};

export const removeAdminRole = async (email: string): Promise<void> => {
  const normalizedEmail = email.toLowerCase();

  const q = query(collection(db, 'roles'), where('email', '==', normalizedEmail));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error('Admin role not found');
  }

  // Delete the role document
  const roleDoc = querySnapshot.docs[0];
  await deleteDoc(doc(db, 'roles', roleDoc.id));
};

export const getAllAdmins = async (): Promise<Role[]> => {
  const querySnapshot = await getDocs(collection(db, 'roles'));
  const roles: Role[] = [];

  querySnapshot.forEach((doc) => {
    roles.push({ id: doc.id, ...doc.data() } as Role);
  });

  return roles;
};
