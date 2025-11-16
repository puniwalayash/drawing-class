import { supabase } from './config';
import { Notification } from '@/types';

export const createNotification = async (
  type: Notification['type'],
  title: string,
  message: string,
  studentId?: string
): Promise<string> => {
  const notificationData = {
    type,
    title,
    message,
    student_id: studentId,
    read: false,
  };

  const { data, error } = await supabase
    .from('notifications')
    .insert([notificationData])
    .select()
    .single();

  if (error) throw error;

  return data.id;
};

export const getUnreadNotifications = async (): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('read', false)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(convertToNotification);
};

export const getAllNotifications = async (limitCount: number = 50): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limitCount);

  if (error) throw error;

  return (data || []).map(convertToNotification);
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);

  if (error) throw error;
};

function convertToNotification(data: any): Notification {
  return {
    id: data.id,
    type: data.type,
    title: data.title,
    message: data.message,
    studentId: data.student_id,
    read: data.read,
    createdAt: data.created_at,
  };
}
