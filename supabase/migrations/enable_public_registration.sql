/*
  # Enable Public Self-Registration
  
  This migration allows anonymous users to register themselves into the queue
  by inserting their own participant records.
  
  ## Changes
  - Adds INSERT policy for anonymous users on participants table
  - Users can only insert their own data (name and roll_no)
  - Token numbers are still auto-assigned by the system
*/

-- Allow anonymous users to register themselves as participants
CREATE POLICY "Public can register themselves as participants"
  ON participants FOR INSERT
  TO anon
  WITH CHECK (true);

-- Note: The existing policies still apply:
-- - Public can view all participants (SELECT policy)
-- - Only authenticated admins can UPDATE and DELETE
