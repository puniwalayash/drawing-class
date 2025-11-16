import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Payment } from '@/types';
import { updateStudent } from './students';

export const addPayment = async (
  studentId: string,
  amount: number,
  method: Payment['method'],
  recordedBy: string,
  notes?: string
): Promise<string> => {
  // Create payment record
  const paymentData: Omit<Payment, 'id'> = {
    studentId,
    amount,
    date: Timestamp.now(),
    method,
    notes,
    recordedBy,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'payments'), paymentData);

  // Update student's amountPaid
  const paymentsQuery = query(
    collection(db, 'payments'),
    where('studentId', '==', studentId)
  );
  const paymentsSnapshot = await getDocs(paymentsQuery);

  let totalPaid = 0;
  paymentsSnapshot.forEach((doc) => {
    const payment = doc.data() as Payment;
    totalPaid += payment.amount;
  });

  await updateStudent(studentId, { amountPaid: totalPaid });

  return docRef.id;
};

export const getPaymentsByStudent = async (studentId: string): Promise<Payment[]> => {
  const q = query(
    collection(db, 'payments'),
    where('studentId', '==', studentId),
    orderBy('date', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const payments: Payment[] = [];

  querySnapshot.forEach((doc) => {
    payments.push({ id: doc.id, ...doc.data() } as Payment);
  });

  return payments;
};

export const getAllPayments = async (): Promise<Payment[]> => {
  const q = query(collection(db, 'payments'), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);

  const payments: Payment[] = [];
  querySnapshot.forEach((doc) => {
    payments.push({ id: doc.id, ...doc.data() } as Payment);
  });

  return payments;
};
