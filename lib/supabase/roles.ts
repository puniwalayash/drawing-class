import { supabase } from './config';
import { Role } from '@/types';

export const addAdminRole = async (email: string, addedBy: string): Promise<string> => {
  const normalizedEmail = email.toLowerCase();

  const { data: existing, error: checkError } = await supabase
    .from('roles')
    .select('email')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (checkError) throw checkError;

  if (existing) {
    throw new Error('Admin role already exists for this email');
  }

  const roleData = {
    email: normalizedEmail,
    role: 'admin',
    added_by: addedBy,
  };

  const { data, error } = await supabase
    .from('roles')
    .insert([roleData])
    .select()
    .single();

  if (error) throw error;

  return data.id;
};

export const removeAdminRole = async (email: string): Promise<void> => {
  const normalizedEmail = email.toLowerCase();

  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('email', normalizedEmail);

  if (error) throw error;
};

export const getAllAdmins = async (): Promise<Role[]> => {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(convertToRole);
};

function convertToRole(data: any): Role {
  return {
    id: data.id,
    email: data.email,
    role: data.role,
    addedBy: data.added_by,
    createdAt: data.created_at,
  };
}
