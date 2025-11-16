import { supabase } from './config';
import { User } from '@/types';

export const signInWithEmailPassword = async (
  email: string,
  password: string
): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('No user returned');

  const isAdmin = await checkIfAdmin(data.user.email || '');

  return {
    uid: data.user.id,
    email: data.user.email || null,
    displayName: data.user.user_metadata?.display_name || data.user.email || null,
    photoURL: data.user.user_metadata?.avatar_url || null,
    isAdmin,
  };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

export const checkIfAdmin = async (email: string): Promise<boolean> => {
  if (!email) return false;

  const { data, error } = await supabase
    .from('roles')
    .select('email')
    .eq('email', email.toLowerCase())
    .eq('role', 'admin')
    .maybeSingle();

  if (error) {
    console.error('Error checking admin role:', error);
    return false;
  }

  return !!data;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const isAdmin = await checkIfAdmin(user.email || '');

  return {
    uid: user.id,
    email: user.email || null,
    displayName: user.user_metadata?.display_name || user.email || null,
    photoURL: user.user_metadata?.avatar_url || null,
    isAdmin,
  };
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        const isAdmin = await checkIfAdmin(session.user.email || '');
        callback({
          uid: session.user.id,
          email: session.user.email || null,
          displayName: session.user.user_metadata?.display_name || session.user.email || null,
          photoURL: session.user.user_metadata?.avatar_url || null,
          isAdmin,
        });
      } else {
        callback(null);
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };
};
