# Database Migration Instructions

## Enable Public Self-Registration

To allow participants to register themselves, you need to run the SQL migration in your Supabase dashboard.

### Steps:

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `gfpmvzkhzakmgouqwvnk`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Copy the contents of `supabase/migrations/enable_public_registration.sql`
   - Paste it into the SQL editor
   - Click "Run" or press Ctrl+Enter

4. **Verify the Policy**
   - Go to "Authentication" → "Policies" 
   - Check the `participants` table
   - You should see a new policy: "Public can register themselves as participants"

### Migration SQL:

```sql
/*
  # Enable Public Self-Registration
  
  This migration allows anonymous users to register themselves into the queue
  by inserting their own participant records.
*/

-- Allow anonymous users to register themselves as participants
CREATE POLICY "Public can register themselves as participants"
  ON participants FOR INSERT
  TO anon
  WITH CHECK (true);
```

### What This Does:

- ✅ Allows anonymous (non-logged-in) users to INSERT into the `participants` table
- ✅ Users can register with their name and roll number
- ✅ Token numbers are still auto-assigned by the system
- ✅ Only INSERT permission (no UPDATE or DELETE)
- ✅ Admin privileges remain unchanged

### Testing:

After running the migration:
1. Start your development server: `npm run dev`
2. Open the public queue view
3. Click "Join Queue"
4. Fill in name and roll number
5. Click "Register"
6. You should see a success message and your token number will appear in the queue

### Troubleshooting:

If registration fails:
- Check browser console for errors
- Verify the policy was created in Supabase dashboard
- Ensure your Supabase credentials in `.env` are correct
- Check if Realtime is enabled for your tables in Supabase dashboard
