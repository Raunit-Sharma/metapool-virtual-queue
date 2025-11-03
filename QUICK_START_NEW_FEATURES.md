# 🚀 Quick Start Guide - New Features

## ⚠️ IMPORTANT: Run This First!

Before using the new features, you **MUST** run this SQL in your Supabase dashboard:

### Option 1: Via Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/gfpmvzkhzakmgouqwvnk/sql/new
2. Paste this SQL:
```sql
CREATE POLICY "Public can register themselves as participants"
  ON participants FOR INSERT
  TO anon
  WITH CHECK (true);
```
3. Click "Run" (or Ctrl+Enter)

### Option 2: Use the Migration File
1. Open `supabase/migrations/enable_public_registration.sql`
2. Copy all contents
3. Paste in Supabase SQL Editor
4. Run it

---

## ✅ New Features Overview

### 1️⃣ Self-Registration (Public Users)
- **What:** Anyone can join the queue without admin help
- **Where:** Public queue page
- **How:** Click "Join Queue" → Fill name & roll no. → Register

### 2️⃣ Skip Functionality (Admin Only)
- **What:** Skip to next participant if current one is not available
- **Where:** Admin dashboard
- **How:** Click "Skip (Not Available)" button

### 3️⃣ Real-time Updates
- **What:** Instant updates without manual refresh
- **Where:** Both public and admin views
- **How:** Automatic via WebSocket

---

## 🎮 How to Use

### For Public Users (Participants):

1. **Open the website**: http://localhost:5173/
2. **Click "Join Queue"** (green button at top)
3. **Fill in the form:**
   - Full Name: Your name
   - Roll Number: Your roll number (must be unique)
4. **Click "Register"**
5. **Success!** Your token number appears in the queue
6. **Watch the queue** update automatically

### For Admins:

1. **Click "Admin"** button (bottom-right)
2. **Login** with credentials
3. **Current serving** shows in blue card
4. **Next participant** shows in green card with 2 options:
   
   **Option A: Participant is available**
   - Click **"Call Next & Complete Current"**
   - Marks current as completed
   - Advances to next token
   
   **Option B: Participant is NOT available**
   - Click **"Skip (Not Available)"**
   - Does NOT mark as completed
   - Just moves to next token

---

## 🧪 Testing Checklist

- [ ] SQL migration is run in Supabase
- [ ] Dev server is running (`npm run dev`)
- [ ] Can open public queue page
- [ ] Can click "Join Queue" button
- [ ] Can submit registration form
- [ ] Token appears in queue after registration
- [ ] Can login as admin
- [ ] Can see "Call Next & Complete Current" button
- [ ] Can see "Skip (Not Available)" button
- [ ] Token updates automatically in both views

---

## 🐛 Troubleshooting

### Registration fails with "Failed to register"
- ❌ SQL migration not run yet
- ✅ Run the SQL in Supabase dashboard

### "This roll number is already registered"
- ❌ Roll number must be unique
- ✅ Use a different roll number

### Buttons not showing in admin dashboard
- ❌ No participants in queue
- ✅ Add at least 2 participants to see buttons

### Token not updating
- ❌ Real-time not enabled in Supabase
- ✅ Check Supabase → Database → Replication → Enable for `participants` and `queue_settings`

---

## 📋 Admin Default Credentials

- **Email:** admin@metapool.com
- **Password:** rk@600+

⚠️ Change this in production!

---

## 🎯 What Each Button Does

### Public View:
- **Join Queue** - Opens registration form
- **Refresh** - Manually refresh queue (usually not needed)

### Admin View:
- **Add Participant** - Admin can manually add someone
- **Call Next & Complete Current** - Normal flow, participant done
- **Skip (Not Available)** - Participant didn't show up, move on
- **Complete** - Mark specific participant as done (in table)

---

## 📱 Mobile Support

All features work perfectly on mobile:
- ✅ Touch-friendly buttons
- ✅ Responsive forms
- ✅ Optimized layouts
- ✅ Easy to use on small screens

---

## 🔥 Dev Server Running

Server is live at: **http://localhost:5173/**

To stop: Press `Ctrl+C` in terminal

To restart: Run `npm run dev`

---

**Need help?** Check `NEW_FEATURES_SUMMARY.md` for detailed documentation!
