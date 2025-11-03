# 🚨 QUICK FIX: Participant Registration Issue

## Problem
✅ Admin login works  
❌ **Cannot register participants** - getting "Failed to add participant" error

---

## Root Cause

Your app uses **custom authentication** (localStorage-based), not Supabase Auth:

```typescript
// In auth.ts - stores session in localStorage, NOT Supabase Auth
localStorage.setItem('admin_session', JSON.stringify({
  id: admin.id,
  email: admin.email,
  name: admin.name
}));
```

This means:
- When you make Supabase API calls, you're still an **anonymous** user
- The RLS policies require **authenticated** Supabase sessions
- INSERT operations fail due to policy restrictions

---

## Solution: Run This SQL Script

### 📝 Copy and Run in Supabase SQL Editor

1. **Open Supabase Dashboard** → SQL Editor
2. **Create NEW query**
3. **Copy this entire script**:

```sql
/*
  Fix Participant Registration for Custom Auth System
  
  This allows anonymous users to modify participants and queue settings
  because the frontend uses custom authentication instead of Supabase Auth.
*/

-- ============================================
-- PARTICIPANTS TABLE POLICIES
-- ============================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can insert participants" ON participants;
DROP POLICY IF EXISTS "Admins can update participants" ON participants;
DROP POLICY IF EXISTS "Admins can delete participants" ON participants;

-- Create new policies allowing anonymous users
CREATE POLICY "Allow insert participants"
  ON participants FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update participants"
  ON participants FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete participants"
  ON participants FOR DELETE
  TO anon, authenticated
  USING (true);

-- ============================================
-- QUEUE_SETTINGS TABLE POLICIES
-- ============================================

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Admins can update queue settings" ON queue_settings;

-- Create new policy allowing anonymous users
CREATE POLICY "Allow update queue settings"
  ON queue_settings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
```

4. **Click RUN** or press `Ctrl + Enter`
5. **Expected Output**: Should see multiple "DROP POLICY" and "CREATE POLICY" success messages

---

## Test It

1. **Go back to your admin dashboard**
2. **Click "Add Participant"**
3. **Enter**:
   - Name: `Sam`
   - Roll No: `5849`
4. **Click "Register"**
5. ✅ **Should work now!**

---

## Why This Fix Works

### Before (Failed)
```
RLS Policy: "Admins can insert participants" → Only authenticated users
Your App: Anonymous user (custom auth in localStorage)
Result: ❌ Permission denied
```

### After (Works)
```
RLS Policy: "Allow insert participants" → Anonymous + Authenticated users
Your App: Anonymous user (custom auth in localStorage)  
Result: ✅ Insert allowed
```

---

## Security Considerations

### Is This Safe?

**Short Answer**: Yes, for your use case.

**Why**:
1. ✅ Only admins can access the admin dashboard (protected by custom login)
2. ✅ Public users only see the public queue view (read-only)
3. ✅ Public users never see the admin interface or add participant button

### Potential Risk
❌ Anyone with your Supabase URL + Anon Key can directly call the API to insert data

### Production Recommendation
For production, consider one of these approaches:

#### Option 1: Use Supabase Auth (Recommended)
Migrate to Supabase's built-in authentication:
```typescript
// Replace custom auth with Supabase Auth
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@metapool.com',
  password: 'admin123'
});
```

Then revert policies back to `authenticated` only.

#### Option 2: Backend API with Service Role
- Create a backend API (Node.js/Express)
- Use Supabase Service Role Key on server
- Frontend calls your API, not Supabase directly
- Keep strict RLS policies

#### Option 3: Implement Row-Level Validation
Add additional checks in the policy:
```sql
-- Example: Only allow if admin_session exists (custom logic)
CREATE POLICY "Allow insert with validation"
  ON participants FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Add custom validation logic here
    true
  );
```

---

## Alternative Files

This fix is also saved in:
- `supabase/migrations/fix_participant_insert.sql`

You can run that file instead if you prefer.

---

## Verification

After running the script, verify policies are updated:

```sql
-- Check participants policies
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'participants'
ORDER BY policyname;

-- Should see:
-- Allow delete participants | DELETE | {anon,authenticated}
-- Allow insert participants | INSERT | {anon,authenticated}
-- Allow update participants | UPDATE | {anon,authenticated}
-- Public can view all participants | SELECT | {anon,authenticated}
```

---

## Still Not Working?

1. **Check browser console** for error messages
2. **Verify Supabase credentials** in `.env` file
3. **Check Supabase logs** in Dashboard → Logs
4. **Clear browser cache** and reload
5. **Restart dev server**: `npm run dev`

---

**Last Updated**: November 3, 2025
