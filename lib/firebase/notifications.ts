import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Notification } from '@/types';

export const createNotification = async (
  type: Notification['type'],
  title: string,
  message: string,
  studentId?: string
): Promise<string> => {
  const notificationData: Omit<Notification, 'id'> = {
    type,
    title,
    message,
    studentId,
    read: false,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'notifications'), notificationData);
  return docRef.id;
};

export const getUnreadNotifications = async (): Promise<Notification[]> => {
  const q = query(
    collection(db, 'notifications'),
    where('read', '==', false),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const notifications: Notification[] = [];

  querySnapshot.forEach((doc) => {
    notifications.push({ id: doc.id, ...doc.data() } as Notification);
  });

  return notifications;
};

export const getAllNotifications = async (limitCount: number = 50): Promise<Notification[]> => {
  const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));

  const querySnapshot = await getDocs(q);
  const notifications: Notification[] = [];

  querySnapshot.forEach((doc) => {
    notifications.push({ id: doc.id, ...doc.data() } as Notification);
  });

  return notifications.slice(0, limitCount);
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  const docRef = doc(db, 'notifications', id);
  await updateDoc(docRef, { read: true });
};
