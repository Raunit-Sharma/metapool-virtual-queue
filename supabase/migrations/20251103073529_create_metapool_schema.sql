/*
  # METAPOOL Virtual Queue Management Schema

  ## Overview
  Creates tables and security policies for a virtual queue management system with admin and participant roles.

  ## New Tables
  
  ### 1. `admin_users`
  Stores admin credentials for queue management
  - `id` (uuid, primary key) - Unique admin identifier
  - `email` (text, unique) - Admin login email
  - `password_hash` (text) - Hashed password for security
  - `name` (text) - Admin display name
  - `created_at` (timestamptz) - Account creation timestamp
  
  ### 2. `participants`
  Stores participant registration data
  - `id` (uuid, primary key) - Unique participant identifier
  - `token_number` (integer, unique) - Auto-assigned queue token
  - `name` (text) - Participant full name
  - `roll_no` (text, unique) - Roll number for identification
  - `registered_at` (timestamptz) - Registration timestamp
  - `status` (text) - Current status: 'waiting', 'called', 'completed'
  
  ### 3. `queue_settings`
  Stores global queue state
  - `id` (integer, primary key) - Singleton row ID (always 1)
  - `current_token` (integer) - Currently active token number
  - `updated_at` (timestamptz) - Last update timestamp
  - `updated_by` (uuid) - Admin who made the last update
  
  ## Security
  - RLS enabled on all tables
  - Admins can manage all data via authenticated access
  - Public users can view participants and queue settings (read-only)
  - Only admins can modify data
  
  ## Notes
  - Token numbers auto-increment starting from 1
  - Queue settings table is a singleton (one row only)
  - Roll numbers are used for participant identification
  - Queue is publicly viewable without authentication
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create participants table with auto-incrementing token
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_number integer UNIQUE NOT NULL,
  name text NOT NULL,
  roll_no text UNIQUE NOT NULL,
  registered_at timestamptz DEFAULT now(),
  status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'completed'))
);

-- Create sequence for token numbers
CREATE SEQUENCE IF NOT EXISTS token_number_seq START WITH 1;

-- Create function to auto-assign token number
CREATE OR REPLACE FUNCTION assign_token_number()
RETURNS trigger AS $$
BEGIN
  IF NEW.token_number IS NULL THEN
    NEW.token_number := nextval('token_number_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-assigning token numbers
DROP TRIGGER IF EXISTS auto_assign_token ON participants;
CREATE TRIGGER auto_assign_token
  BEFORE INSERT ON participants
  FOR EACH ROW
  EXECUTE FUNCTION assign_token_number();

-- Create queue_settings table (singleton)
CREATE TABLE IF NOT EXISTS queue_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  current_token integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES admin_users(id)
);

-- Insert initial queue settings row
INSERT INTO queue_settings (id, current_token) 
VALUES (1, 0) 
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_settings ENABLE ROW LEVEL SECURITY;

-- Admin users policies (only authenticated admins can view)
CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert new admins"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Participants policies (PUBLIC READ ACCESS)
CREATE POLICY "Public can view all participants"
  ON participants FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert participants"
  ON participants FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update participants"
  ON participants FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete participants"
  ON participants FOR DELETE
  TO authenticated
  USING (true);

-- Queue settings policies (PUBLIC READ ACCESS)
CREATE POLICY "Public can view queue settings"
  ON queue_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can update queue settings"
  ON queue_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_participants_token ON participants(token_number);
CREATE INDEX IF NOT EXISTS idx_participants_roll ON participants(roll_no);
CREATE INDEX IF NOT EXISTS idx_participants_status ON participants(status);

-- Insert default admin user (password: admin123)
-- NOTE: In production, change this password immediately!
INSERT INTO admin_users (email, password_hash, name)
VALUES ('admin@metapool.com', 'rk@600+', 'Default Admin')
ON CONFLICT (email) DO NOTHING;
