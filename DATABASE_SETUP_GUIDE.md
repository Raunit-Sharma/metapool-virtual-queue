# 📋 METAPOOL Database Setup Guide

## Overview
This guide explains how to properly set up and fix the Supabase database for the METAPOOL Virtual Queue system.

---

## 🚀 Initial Database Setup (First Time Only)

### Step 1: Run Main Migration Script

1. **Open Supabase Dashboard** → Go to SQL Editor
2. **Copy the entire content** from `supabase/migrations/20251103073529_create_metapool_schema.sql`
3. **Paste and Run** the script **ONLY ONCE**
4. **Verify Success**: Check that these tables exist:
   - `admin_users`
   - `participants`
   - `queue_settings`

### Step 2: Fix Admin Login Policy

1. **Open a NEW SQL Editor tab** in Supabase
2. **Copy the entire content** from `supabase/migrations/fix_admin_login.sql`
3. **Paste and Run** the script
4. **Expected Output**: `DROP POLICY` and `CREATE POLICY` should succeed

### Step 3: Fix Participant Registration

1. **Open a NEW SQL Editor tab** in Supabase
2. **Copy the entire content** from `supabase/migrations/fix_participant_insert.sql`
3. **Paste and Run** the script
4. **Expected Output**: Multiple `DROP POLICY` and `CREATE POLICY` should succeed
5. **Why Needed**: The app uses custom authentication (not Supabase Auth), so admins appear as anonymous users to the database

---

## ❌ Common Errors and Solutions

### Error 1: "policy already exists"
```
ERROR: 42710: policy "Admins can view all admin users" for table "admin_users" already exists
```

**Cause**: You're trying to run the main migration script multiple times.

**Solution**:
- ✅ **DO NOT** run the main migration script again
- ✅ Run **only** the fix script: `fix_admin_login.sql`
- ✅ If you need to recreate everything, see "Complete Database Reset" below

---

### Error 2: "relation does not exist"
```
ERROR: relation "admin_users" does not exist
```

**Cause**: The main migration script hasn't been run yet.

**Solution**:
1. Run the main migration first: `20251103073529_create_metapool_schema.sql`
2. Then run the fix script: `fix_admin_login.sql`

---

### Error 3: Admin login not working

**Symptoms**:
- Can't login with admin credentials
- Get "Invalid email or password" even with correct credentials
- Network errors when trying to login

**Diagnosis**:
1. Check if fix script has been run
2. Verify policy exists:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'admin_users';
   ```
3. Should see policy: `"Allow anonymous read for login"`

**Solution**:
Run the fix script if policy doesn't exist:
```sql
-- Copy and run from fix_admin_login.sql
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;

CREATE POLICY "Allow anonymous read for login"
  ON admin_users FOR SELECT
  TO anon, authenticated
  USING (true);
```

---

### Error 4: "Failed to add participant"

**Symptoms**:
- Admin can login successfully
- Can see the dashboard
- Gets error "Failed to add participant" when trying to register someone
- Error message might say "new row violates row-level security policy"

**Cause**:
The app uses custom authentication (localStorage) instead of Supabase Auth, so admins appear as anonymous users. The old RLS policies only allowed "authenticated" Supabase sessions to insert/update/delete.

**Diagnosis**:
```sql
-- Check current policies on participants table
SELECT policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'participants';
```

**Solution**:
Run the participant fix script:
```sql
-- Copy and run from fix_participant_insert.sql
-- This allows anonymous users to modify participants
-- (Frontend is protected by custom admin login)
```

Or run the complete fix script: `supabase/migrations/fix_participant_insert.sql`

---

## 🔄 Complete Database Reset (Nuclear Option)

**⚠️ WARNING**: This will delete ALL data!

### Step 1: Drop All Tables
```sql
-- Drop tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS queue_settings CASCADE;
DROP TABLE IF EXISTS participants CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Drop sequence
DROP SEQUENCE IF EXISTS token_number_seq CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS assign_token_number() CASCADE;
```

### Step 2: Recreate Everything
1. Run main migration: `20251103073529_create_metapool_schema.sql`
2. Run fix script: `fix_admin_login.sql`
3. Run fix script: `fix_participant_insert.sql`

---

## ✅ Verification Checklist

After running migrations, verify everything is working:

### 1. Check Tables Exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('admin_users', 'participants', 'queue_settings');
```
**Expected**: 3 rows returned

### 2. Check Default Admin Exists
```sql
SELECT email, name FROM admin_users WHERE email = 'admin@metapool.com';
```
**Expected**: 1 row with email `admin@metapool.com`

### 3. Check Queue Settings Initialized
```sql
SELECT * FROM queue_settings WHERE id = 1;
```
**Expected**: 1 row with `current_token = 0`

### 4. Check RLS Policies
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('admin_users', 'participants', 'queue_settings')
ORDER BY tablename, policyname;
```
**Expected**: Multiple policies including "Allow anonymous read for login" for admin_users

### 5. Test Login from Application
- Open application: `http://localhost:5173`
- Click "Admin" button
- Login with:
  - Email: `admin@metapool.com`
  - Password: `rk@600+`
- **Expected**: Successfully logged in to admin dashboard

---

## 🔐 Security Notes

### Current Implementation
- **Password Storage**: Plain text (for demo purposes)
- **Admin Login**: Uses anonymous Supabase access to read admin table
- **RLS Policies**: 
  - Public can read participants and queue settings
  - Only authenticated sessions can modify data

### Production Recommendations
1. **Implement Proper Password Hashing**:
   - Use bcrypt/argon2 on a backend server
   - Never store plain text passwords
   
2. **Use Supabase Auth**:
   - Migrate to Supabase's built-in authentication
   - Use proper JWT tokens
   
3. **Secure Admin Table**:
   - Move admin table behind server-side API
   - Don't expose admin credentials table to client

4. **Environment Variables**:
   - Never commit `.env` file
   - Use different keys for dev/production

---

## 📊 Database Schema Reference

### admin_users
```sql
id              uuid PRIMARY KEY
email           text UNIQUE NOT NULL
password_hash   text NOT NULL
name            text NOT NULL
created_at      timestamptz DEFAULT now()
```

### participants
```sql
id              uuid PRIMARY KEY
token_number    integer UNIQUE NOT NULL
name            text NOT NULL
roll_no         text UNIQUE NOT NULL
registered_at   timestamptz DEFAULT now()
status          text DEFAULT 'waiting' CHECK (status IN ('waiting', 'called', 'completed'))
```

### queue_settings
```sql
id              integer PRIMARY KEY CHECK (id = 1)
current_token   integer DEFAULT 0
updated_at      timestamptz DEFAULT now()
updated_by      uuid REFERENCES admin_users(id)
```

---

## 🛠️ Maintenance Operations

### Reset Queue (Keep Participants)
```sql
UPDATE queue_settings SET current_token = 0 WHERE id = 1;
UPDATE participants SET status = 'waiting';
```

### Clear All Participants
```sql
DELETE FROM participants;
ALTER SEQUENCE token_number_seq RESTART WITH 1;
UPDATE queue_settings SET current_token = 0 WHERE id = 1;
```

### Add New Admin
```sql
INSERT INTO admin_users (email, password_hash, name)
VALUES ('newadmin@example.com', 'password123', 'New Admin Name');
```

### Change Admin Password
```sql
UPDATE admin_users 
SET password_hash = 'new_password_here'
WHERE email = 'admin@metapool.com';
```

---

## 📞 Support

If you encounter issues:
1. Check this guide thoroughly
2. Verify all steps in "Verification Checklist"
3. Check browser console for JavaScript errors
4. Check Supabase logs in dashboard
5. Ensure environment variables are correct in `.env`

---

**Last Updated**: November 3, 2025
**Version**: 1.0
