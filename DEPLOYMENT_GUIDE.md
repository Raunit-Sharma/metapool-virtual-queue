# 🚀 METAPOOL Virtual Queue - Deployment Guide

Complete step-by-step guide to deploy your METAPOOL Virtual Queue application to production.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- ✅ Supabase account and project created
- ✅ Database migrations run successfully
- ✅ Application tested locally and working
- ✅ GitHub account (for Vercel deployment)
- ✅ Your Supabase credentials ready

---

## 🎯 Deployment Options

We'll cover two popular options:
1. **Vercel** (Recommended - Easiest, Free)
2. **Netlify** (Alternative - Also Free)

---

## 🌟 Option 1: Deploy to Vercel (RECOMMENDED)

Vercel is the easiest and most reliable option for React/Vite apps.

### Step 1: Prepare Your Supabase Database

**Important**: If you haven't run the database migrations yet, do it now!

1. **Go to Supabase Dashboard** → SQL Editor
2. **Run these scripts in order**:
   
   a. Main Schema (ONLY if not already run):
   ```sql
   -- Copy entire content from: supabase/migrations/20251103073529_create_metapool_schema.sql
   -- Paste and run in SQL Editor
   ```
   
   b. Fix Admin Login:
   ```sql
   -- Copy entire content from: supabase/migrations/fix_admin_login.sql
   -- Paste and run in SQL Editor
   ```
   
   c. Fix Participant Insert:
   ```sql
   -- Copy entire content from: supabase/migrations/fix_participant_insert.sql
   -- Paste and run in SQL Editor
   ```

3. **Verify**: Check that tables exist in Table Editor:
   - admin_users
   - participants
   - queue_settings

### Step 2: Get Your Supabase Credentials

1. **Go to Supabase Dashboard** → Settings → API
2. **Copy these values** (you'll need them later):
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### Step 3: Push Your Code to GitHub

1. **Initialize Git** (if not already done):
   ```powershell
   git init
   git add .
   git commit -m "Initial commit - METAPOOL Virtual Queue"
   ```

2. **Create a GitHub Repository**:
   - Go to [github.com](https://github.com) → New Repository
   - Name it: `metapool-virtual-queue`
   - Make it **Public** or **Private** (your choice)
   - **DO NOT** initialize with README (you already have one)
   - Click "Create repository"

3. **Push to GitHub**:
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/metapool-virtual-queue.git
   git branch -M main
   git push -u origin main
   ```
   
   Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 4: Deploy on Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Sign Up"** or **"Login"** (use GitHub to login)
3. **Click "Add New Project"**
4. **Import Your Repository**:
   - Find and select `metapool-virtual-queue`
   - Click "Import"

5. **Configure Build Settings**:
   - **Framework Preset**: Vite ✅ (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` ✅ (auto-detected)
   - **Output Directory**: `dist` ✅ (auto-detected)

6. **Add Environment Variables**:
   Click "Environment Variables" section and add:
   
   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | Your Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
   
   ⚠️ **IMPORTANT**: Use the values you copied in Step 2!

7. **Click "Deploy"** 🚀

8. **Wait 2-3 minutes** for deployment to complete

9. **🎉 Done!** Your app is live at: `https://your-project.vercel.app`

### Step 5: Test Your Deployment

1. **Visit your Vercel URL**
2. **Test Public View**: Should see the queue display
3. **Test Admin Login**:
   - Click "Admin" button (bottom right)
   - Login with:
     - Email: `admin@metapool.com`
     - Password: `rk@600+`
   - Try adding a participant
   - Try advancing the queue

### Step 6: Set Up Custom Domain (Optional)

1. **In Vercel Dashboard** → Your Project → Settings → Domains
2. **Add your domain** (e.g., `metapool.yourdomain.com`)
3. **Follow DNS instructions** provided by Vercel
4. **Wait for DNS propagation** (can take up to 48 hours)

---

## 🔄 Updating Your Deployed App

Whenever you make changes:

1. **Commit and push to GitHub**:
   ```powershell
   git add .
   git commit -m "Your update message"
   git push
   ```

2. **Vercel auto-deploys** your changes! 🎉
   - Wait 2-3 minutes
   - Changes are live automatically

---

## 🌐 Option 2: Deploy to Netlify (Alternative)

### Method A: Drag & Drop (Quickest)

1. **Build Your Project**:
   ```powershell
   npm run build
   ```
   This creates a `dist` folder.

2. **Go to [netlify.com](https://netlify.com)** and login

3. **Drag the `dist` folder** to Netlify Drop

4. **Add Environment Variables**:
   - Site Settings → Build & Deploy → Environment
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

5. **Redeploy** after adding env variables:
   - Deploys → Trigger Deploy → Deploy Site

### Method B: Connect to GitHub

1. **Push to GitHub** (same as Vercel Step 3)

2. **Go to Netlify** → Add New Site → Import Existing Project

3. **Connect to GitHub** and select your repository

4. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Add Environment Variables** (same as Method A)

6. **Deploy**

---

## 🔐 Post-Deployment Security

### 1. Change Default Admin Password

**CRITICAL**: Change the default password immediately!

Go to Supabase SQL Editor and run:
```sql
UPDATE admin_users 
SET password_hash = 'YOUR_NEW_SECURE_PASSWORD'
WHERE email = 'admin@metapool.com';
```

Replace `YOUR_NEW_SECURE_PASSWORD` with a strong password.

### 2. Create Additional Admin Accounts

```sql
INSERT INTO admin_users (email, password_hash, name)
VALUES ('youremail@example.com', 'your_password', 'Your Name');
```

### 3. Monitor Supabase Usage

- Go to Supabase → Settings → Usage
- Stay within free tier limits (500MB database, 2GB bandwidth)
- Upgrade if needed

---

## 📊 Monitoring Your Deployed App

### Vercel Analytics (Built-in)

1. **Go to Vercel Dashboard** → Your Project → Analytics
2. **View**:
   - Page views
   - Unique visitors
   - Performance metrics
   - Real-time traffic

### Supabase Monitoring

1. **Go to Supabase Dashboard** → Database → Usage
2. **Monitor**:
   - Database size
   - API requests
   - Active connections
   - Query performance

---

## 🐛 Troubleshooting Deployment Issues

### Issue 1: "Missing environment variables" error

**Solution**:
- Double-check environment variables in Vercel/Netlify dashboard
- Make sure they're named exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Redeploy after adding variables

### Issue 2: White screen / Blank page

**Solution**:
- Check browser console for errors (F12)
- Verify environment variables are set correctly
- Check Supabase credentials are valid
- View deployment logs in Vercel/Netlify

### Issue 3: Admin login fails in production

**Possible Causes**:
- Database migrations not run
- Wrong Supabase credentials in environment variables
- RLS policies not set up correctly

**Solution**:
- Re-run the fix migration scripts in Supabase
- Verify environment variables match your Supabase project
- Test database connection from Supabase dashboard

### Issue 4: Build fails

**Common Causes**:
- TypeScript errors
- Missing dependencies
- Wrong Node version

**Solution**:
```powershell
# Test build locally first
npm run build

# If it works locally but fails on Vercel, check Node version
# Set Node version in Vercel: Settings → General → Node Version
```

### Issue 5: Participants not showing

**Solution**:
- Check Supabase Table Editor → participants
- Verify RLS policies allow public read:
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'participants';
  ```
- Check browser console for CORS or API errors

---

## 📱 Mobile Testing

After deployment, test on actual mobile devices:

### iOS
- Safari
- Chrome for iOS

### Android
- Chrome
- Samsung Internet
- Firefox

**Test Features**:
- ✅ Queue display is readable
- ✅ Admin login works
- ✅ Add participant form is usable
- ✅ Buttons are easily tappable
- ✅ Auto-refresh works

---

## 🎯 Performance Optimization

### Enable Caching

Vercel and Netlify automatically cache static assets. No configuration needed!

### Reduce Bundle Size (Optional)

If your app becomes slow:

```powershell
# Analyze bundle size
npm run build

# Check the dist folder size
```

---

## 💰 Cost Estimation

### Free Tier Limits

**Vercel Free Tier**:
- ✅ 100GB bandwidth/month
- ✅ Unlimited projects
- ✅ Automatic SSL
- ✅ Custom domains
- ✅ More than enough for small-medium events

**Supabase Free Tier**:
- ✅ 500MB database
- ✅ 2GB bandwidth/month
- ✅ 50,000 monthly active users
- ✅ Plenty for most use cases

**Expected Usage** (example event):
- 500 participants per day
- Each participant checks queue 10 times
- Admins check dashboard continuously
- **Result**: Well within free limits! ✅

---

## 🔄 Backup and Recovery

### Backup Participants Data

Run this in Supabase SQL Editor periodically:

```sql
-- Export to CSV (use Table Editor → Export option)
-- Or save this query result:
SELECT * FROM participants ORDER BY token_number;
```

### Backup Queue Settings

```sql
SELECT * FROM queue_settings;
```

### Restore from Backup

If you need to restore data:
```sql
-- Clear existing data
DELETE FROM participants;

-- Insert backup data
INSERT INTO participants (id, token_number, name, roll_no, status)
VALUES 
  ('uuid-here', 1, 'Name', 'Roll', 'waiting'),
  -- ... add more rows
```

---

## 📞 Support and Resources

### Vercel Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Environment Variables](https://vercel.com/docs/environment-variables)
- [Custom Domains](https://vercel.com/docs/custom-domains)

### Supabase Documentation
- [Supabase Docs](https://supabase.com/docs)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Editor](https://supabase.com/docs/guides/database/sql-editor)

### Common Resources
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [React Deployment](https://create-react-app.dev/docs/deployment/)

---

## ✅ Deployment Success Checklist

After deployment, verify:

- [ ] App loads at production URL
- [ ] Public queue view shows correctly
- [ ] Admin button is visible
- [ ] Admin login works
- [ ] Can add participants
- [ ] Token numbers auto-increment
- [ ] Can advance queue (Call Next)
- [ ] Mark as Complete feature works
- [ ] Auto-refresh works (wait 10 seconds)
- [ ] Mobile view is responsive
- [ ] Changed default admin password
- [ ] Environment variables are secured

---

## 🎉 Congratulations!

Your METAPOOL Virtual Queue is now live and accessible to the public!

**Share your deployment URL** with:
- Event participants (for public queue view)
- Admins (share admin login credentials separately)
- Staff members

**Next Steps**:
1. Change the default admin password
2. Add more admin users if needed
3. Test thoroughly with real data
4. Set up a custom domain (optional)
5. Monitor usage in Vercel/Supabase dashboards

---

**Need Help?**
- Check troubleshooting section above
- Review Supabase logs
- Check Vercel deployment logs
- Verify environment variables

**Last Updated**: November 3, 2025
