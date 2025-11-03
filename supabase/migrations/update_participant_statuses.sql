/*
  # Update Participant Status to Include 'skipped'
  
  This migration updates the participants table to support three statuses:
  - 'waiting' - Default status when participant registers
  - 'done' - Participant has completed their turn (was 'completed')
  - 'skipped' - Participant's turn arrived but they weren't available
  
  ## Changes
  - Drops old CHECK constraint
  - Adds new CHECK constraint with three statuses
  - Updates existing 'completed' records to 'done' for consistency
*/

-- Drop the old CHECK constraint
ALTER TABLE participants 
  DROP CONSTRAINT IF EXISTS participants_status_check;

-- Add new CHECK constraint with three statuses
ALTER TABLE participants
  ADD CONSTRAINT participants_status_check 
  CHECK (status IN ('waiting', 'done', 'skipped'));

-- Update any existing 'completed' or 'called' records to 'done'
UPDATE participants 
SET status = 'done' 
WHERE status IN ('completed', 'called');

-- Note: This migration is safe to run multiple times
