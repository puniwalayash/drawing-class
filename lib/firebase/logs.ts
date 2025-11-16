import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { ActivityLog } from '@/types';

export const logActivity = async (
  action: ActivityLog['action'],
  entityType: ActivityLog['entityType'],
  entityId: string,
  performedBy: string,
  details?: Record<string, any>
): Promise<string> => {
  const logData: Omit<ActivityLog, 'id'> = {
    action,
    entityType,
    entityId,
    performedBy,
    details,
    timestamp: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'logs'), logData);
  return docRef.id;
};

export const getRecentLogs = async (limitCount: number = 50): Promise<ActivityLog[]> => {
  const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(limitCount));
  const querySnapshot = await getDocs(q);

  const logs: ActivityLog[] = [];
  querySnapshot.forEach((doc) => {
    logs.push({ id: doc.id, ...doc.data() } as ActivityLog);
  });

  return logs;
};
