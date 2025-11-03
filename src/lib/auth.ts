import { supabase } from './supabase';

// Simple password hashing function (for basic security)
// Note: In production, consider using a proper backend with bcrypt/argon2
const hashPassword = async (password: string): Promise<string> => {
  // Simple hash for demo purposes - storing plain text with a marker
  // In a real app, use proper backend hashing
  return password; // For simplicity, we'll compare directly
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  // Simple comparison for demo purposes
  return password === hash;
};

export const adminLogin = async (email: string, password: string) => {
  const { data: admin, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error || !admin) {
    throw new Error('Invalid email or password');
  }

  const passwordMatch = await verifyPassword(password, admin.password_hash);

  if (!passwordMatch) {
    throw new Error('Invalid email or password');
  }

  // Store admin session in localStorage
  localStorage.setItem('admin_session', JSON.stringify({
    id: admin.id,
    email: admin.email,
    name: admin.name
  }));

  return admin;
};

export const adminLogout = () => {
  localStorage.removeItem('admin_session');
};

export const getAdminSession = () => {
  const session = localStorage.getItem('admin_session');
  return session ? JSON.parse(session) : null;
};

export const registerAdmin = async (email: string, password: string, name: string) => {
  const hashedPassword = await hashPassword(password);
  
  const { data, error } = await supabase
    .from('admin_users')
    .insert([{ email, password_hash: hashedPassword, name }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
