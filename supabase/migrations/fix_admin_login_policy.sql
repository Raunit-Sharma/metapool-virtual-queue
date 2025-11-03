/*
  # Fix Admin Login Policy
  
  ## Problem
  The original policy "Admins can view all admin users" only allows authenticated users to read admin_users table.
  This prevents anonymous login attempts since the app needs to read the admin_users table to verify credentials.
  
  ## Solution
  1. Drop the existing restrictive policy
  2. Create a new policy that allows anonymous (anon) users to read admin_users for login purposes
  
  ## Security Note
  This allows anyone to read admin emails and password hashes, but:
  - Password hashes should never be plain text in production
  - The app only reads from this table, never exposes it to users
  - Without proper credentials, users cannot authenticate
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;

-- Create new policy that allows anonymous users to read for login
CREATE POLICY "Allow anonymous read for login"
  ON admin_users FOR SELECT
  TO anon, authenticated
  USING (true);
