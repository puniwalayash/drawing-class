import { supabase } from './config';
import { Payment } from '@/types';
import { updateStudent } from './students';

export const addPayment = async (
  studentId: string,
  amount: number,
  method: Payment['method'],
  recordedBy: string,
  notes?: string
): Promise<string> => {
  const paymentData = {
    student_id: studentId,
    amount,
    date: new Date().toISOString(),
    method,
    notes,
    recorded_by: recordedBy,
  };

  const { data, error } = await supabase
    .from('payments')
    .insert([paymentData])
    .select()
    .single();

  if (error) throw error;

  const { data: payments, error: paymentsError } = await supabase
    .from('payments')
    .select('amount')
    .eq('student_id', studentId);

  if (paymentsError) throw paymentsError;

  const totalPaid = (payments || []).reduce((sum, p) => sum + p.amount, 0);
  await updateStudent(studentId, { amountPaid: totalPaid });

  return data.id;
};

export const getPaymentsByStudent = async (studentId: string): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false });

  if (error) throw error;

  return (data || []).map(convertToPayment);
};

export const getAllPayments = async (): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;

  return (data || []).map(convertToPayment);
};

function convertToPayment(data: any): Payment {
  return {
    id: data.id,
    studentId: data.student_id,
    amount: data.amount,
    date: data.date,
    method: data.method,
    notes: data.notes,
    recordedBy: data.recorded_by,
    createdAt: data.created_at,
  };
}
