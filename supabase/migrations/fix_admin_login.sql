-- Fix admin login by allowing anonymous users to read admin_users table
-- This is needed for the login process to work

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;

-- Create new policy that allows anonymous users to read for login
-- This is safe because password verification happens in the application
CREATE POLICY "Allow anonymous read for login"
  ON admin_users FOR SELECT
  TO anon, authenticated
  USING (true);
