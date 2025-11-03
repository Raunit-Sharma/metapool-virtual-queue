/*
  # Fix Participant Status Migration
  
  This fixes the constraint violation by updating data BEFORE adding the constraint.
  
  Run this SQL to fix the error!
*/

-- STEP 1: Update any existing 'completed' or 'called' records to 'done' FIRST
UPDATE participants 
SET status = 'done' 
WHERE status IN ('completed', 'called');

-- STEP 2: Update any other invalid statuses to 'waiting'
UPDATE participants 
SET status = 'waiting' 
WHERE status NOT IN ('waiting', 'done', 'skipped');

-- STEP 3: Drop the old CHECK constraint
ALTER TABLE participants 
  DROP CONSTRAINT IF EXISTS participants_status_check;

-- STEP 4: Add new CHECK constraint with three statuses
ALTER TABLE participants
  ADD CONSTRAINT participants_status_check 
  CHECK (status IN ('waiting', 'done', 'skipped'));
