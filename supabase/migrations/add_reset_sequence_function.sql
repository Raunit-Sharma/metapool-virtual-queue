/*
  # Add Reset Token Sequence Function
  
  This creates a PostgreSQL function that can be called to reset the token sequence.
  This is needed when resetting the queue to start token numbers from 1 again.
*/

-- Create function to reset the token sequence
CREATE OR REPLACE FUNCTION reset_token_sequence()
RETURNS void AS $$
BEGIN
  -- Reset the sequence to start from 1
  ALTER SEQUENCE token_number_seq RESTART WITH 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (admins)
GRANT EXECUTE ON FUNCTION reset_token_sequence() TO authenticated;

-- Also grant to anon for testing (remove in production if needed)
GRANT EXECUTE ON FUNCTION reset_token_sequence() TO anon;
