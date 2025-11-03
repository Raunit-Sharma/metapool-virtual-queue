# 🎯 START HERE - Deployment Instructions

**Welcome!** This guide will help you deploy your METAPOOL Virtual Queue to the internet in about 15 minutes.

---

## 🔍 What You Have

Your METAPOOL Virtual Queue application is **ready to deploy**! Here's what we've set up:

✅ **Application**: React + TypeScript + Vite  
✅ **Database**: Supabase (already configured)  
✅ **Styling**: Tailwind CSS (responsive)  
✅ **Build**: Successfully tested (works!)  
✅ **Credentials**: In your `.env` file (safe)  

---

## 🚀 Choose Your Deployment Method

### Option A: Vercel (RECOMMENDED) 
⭐ **Best for**: Easiest setup, automatic updates from GitHub  
⏱️ **Time**: 15 minutes  
💰 **Cost**: FREE  

### Option B: Netlify
⭐ **Best for**: Quick one-time deploy  
⏱️ **Time**: 10 minutes (drag & drop) or 15 minutes (GitHub)  
💰 **Cost**: FREE  

---

## 🎯 Quick Start: Deploy to Vercel (Recommended)

### Step 1: Run Deployment Preparation (1 minute)

Open PowerShell in this folder and run:

```powershell
.\prepare-deploy.ps1
```

This will:
- Initialize Git repository
- Create initial commit
- Show you next steps

### Step 2: Create GitHub Repository (3 minutes)

1. Go to: **https://github.com/new**
2. Repository name: `metapool-virtual-queue`
3. Visibility: **Public** (or Private if you prefer)
4. **DO NOT** check "Initialize this repository with a README"
5. Click **"Create repository"**

### Step 3: Push to GitHub (2 minutes)

Copy the commands shown after creating the repository, or run these:

```powershell
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/metapool-virtual-queue.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy to Vercel (5 minutes)

1. **Go to**: https://vercel.com
2. **Sign up/Login** with GitHub
3. Click **"Add New Project"**
4. Click **"Import"** next to your `metapool-virtual-queue` repository
5. Vercel will auto-detect Vite settings ✅
6. **Add Environment Variables**:
   ```
   VITE_SUPABASE_URL = https://gfpmvzkhzakmgouqwvnk.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcG12emtoemFrbWdvdXF3dm5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNTYzMzYsImV4cCI6MjA3NzczMjMzNn0.3noMz5YRLM_eqnoXdFybUrOdPQQiSshGCDA90Pw-d7E
   ```
7. Click **"Deploy"** 🚀
8. Wait 2-3 minutes ⏳
9. **Done!** 🎉

### Step 5: Test Your Deployment (2 minutes)

1. Click the URL Vercel gives you (e.g., `https://metapool-virtual-queue.vercel.app`)
2. Test public queue view
3. Click "Admin" button (bottom right)
4. Login:
   - Email: `admin@metapool.com`
   - Password: `rk@600+`
5. Try adding a participant
6. Try advancing the queue

✅ **If everything works, you're DONE!**

### Step 6: Security (1 minute)

**IMPORTANT**: Change the default admin password!

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Run this:
   ```sql
   UPDATE admin_users 
   SET password_hash = 'YourNewSecurePassword123'
   WHERE email = 'admin@metapool.com';
   ```
5. Click **Run**

---

## 🔥 Alternative: Quick Deploy to Netlify (Drag & Drop)

Want to skip GitHub entirely? Use this method:

### Step 1: Build Your App
```powershell
npm run build
```

### Step 2: Deploy
1. Go to: https://app.netlify.com/drop
2. **Drag the `dist` folder** onto the page
3. Wait for upload to complete

### Step 3: Add Environment Variables
1. Go to: **Site Settings** → **Environment Variables**
2. Add:
   ```
   VITE_SUPABASE_URL = https://gfpmvzkhzakmgouqwvnk.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcG12emtoemFrbWdvdXF3dm5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNTYzMzYsImV4cCI6MjA3NzczMjMzNn0.3noMz5YRLM_eqnoXdFybUrOdPQQiSshGCDA90Pw-d7E
   ```

### Step 4: Trigger Redeploy
1. Go to: **Deploys** tab
2. Click: **Trigger deploy** → **Deploy site**
3. Wait 2 minutes
4. **Done!** Test your app

---

## ✅ Deployment Checklist

Before deploying, make sure:

- [x] ✅ Supabase project is set up
- [x] ✅ Database migrations are run
- [x] ✅ App builds successfully (`npm run build`)
- [x] ✅ App works locally (`npm run dev`)
- [x] ✅ Environment variables are ready

After deploying, verify:

- [ ] App loads at public URL
- [ ] Public queue view works
- [ ] Admin login works
- [ ] Can add participants
- [ ] Queue advances correctly
- [ ] Changed default password ⚠️

---

## 📱 Verify Database Setup

If you haven't run the database migrations yet:

1. **Go to Supabase**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to SQL Editor**
4. **Run these scripts** (in order):

   **Script 1**: Main Schema
   ```
   Copy from: supabase/migrations/20251103073529_create_metapool_schema.sql
   ```

   **Script 2**: Fix Admin Login
   ```
   Copy from: supabase/migrations/fix_admin_login.sql
   ```

   **Script 3**: Fix Participant Insert
   ```
   Copy from: supabase/migrations/fix_participant_insert.sql
   ```

5. **Verify**: Check **Table Editor** for these tables:
   - admin_users
   - participants
   - queue_settings

---

## 🐛 Troubleshooting

### Problem: "Missing environment variables"
**Solution**: Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel/Netlify dashboard, then redeploy

### Problem: White/blank page
**Solution**: Check browser console (F12) for errors. Verify environment variables are correct.

### Problem: Can't login as admin
**Solution**: Run the fix migration scripts in Supabase SQL Editor

### Problem: Can't add participants
**Solution**: Run `fix_participant_insert.sql` in Supabase SQL Editor

---

## 📚 Additional Resources

- **Complete Guide**: See `DEPLOYMENT_GUIDE.md`
- **Quick Checklist**: See `QUICK_DEPLOY.md`
- **Database Help**: See `DATABASE_SETUP_GUIDE.md`

---

## 🎉 Ready to Deploy?

1. **Run**: `.\prepare-deploy.ps1`
2. **Follow the steps** above
3. **Share your deployed URL** with users!

Need help? Check the troubleshooting section or see DEPLOYMENT_GUIDE.md for detailed instructions.

---

**Last Updated**: November 3, 2025  
**Version**: 1.0
