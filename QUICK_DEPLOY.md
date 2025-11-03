# ⚡ Quick Deploy Checklist

Use this as a quick reference while deploying. See DEPLOYMENT_GUIDE.md for detailed instructions.

---

## 🚀 Vercel Deployment - Quick Steps

### ✅ Pre-Deploy (5 minutes)

- [ ] **Supabase Setup Complete?**
  - [ ] Project created at supabase.com
  - [ ] Ran `20251103073529_create_metapool_schema.sql`
  - [ ] Ran `fix_admin_login.sql`
  - [ ] Ran `fix_participant_insert.sql`
  - [ ] Tables exist: admin_users, participants, queue_settings

- [ ] **Credentials Ready?**
  - [ ] Copied Supabase URL: `https://xxxxx.supabase.co`
  - [ ] Copied Anon Key: `eyJ...`

- [ ] **Local Testing Done?**
  - [ ] App runs: `npm run dev`
  - [ ] Admin login works
  - [ ] Can add participants
  - [ ] Queue advances properly

---

### 📦 Deploy to Vercel (10 minutes)

1. **Push to GitHub**
   ```powershell
   git init
   git add .
   git commit -m "Deploy METAPOOL Virtual Queue"
   git remote add origin https://github.com/YOUR_USERNAME/metapool-virtual-queue.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   
3. **Add Environment Variables**
   ```
   VITE_SUPABASE_URL = your_supabase_url
   VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```

4. **Click Deploy** 🚀

5. **Wait 2-3 minutes** ⏳

6. **Done!** Visit your app at `https://your-app.vercel.app` 🎉

---

### ✅ Post-Deploy (2 minutes)

- [ ] **Test Deployment**
  - [ ] App loads
  - [ ] Public queue view works
  - [ ] Admin login works (admin@metapool.com / rk@600+)
  - [ ] Can add participants
  - [ ] Can advance queue

- [ ] **Security**
  - [ ] Change default admin password in Supabase:
    ```sql
    UPDATE admin_users SET password_hash = 'NEW_PASSWORD' WHERE email = 'admin@metapool.com';
    ```

- [ ] **Share**
  - [ ] Share public URL with participants
  - [ ] Share admin credentials with staff (securely!)

---

## 🔥 Super Quick Deploy (Netlify Drag & Drop)

If you want to deploy even faster (no GitHub needed):

1. **Build**
   ```powershell
   npm run build
   ```

2. **Drag `dist` folder to [Netlify Drop](https://app.netlify.com/drop)**

3. **Add Environment Variables** in Site Settings

4. **Redeploy** to apply env variables

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank page | Check browser console (F12), verify env variables |
| Can't login | Run fix migration scripts in Supabase |
| Can't add participants | Run `fix_participant_insert.sql` in Supabase |
| Build fails | Run `npm run build` locally to check errors |

---

## 📱 Test on Mobile

After deploy, scan this QR code (generate at your Vercel URL):
- iOS: Safari, Chrome
- Android: Chrome, Samsung Internet

---

## 🎯 Next Steps

1. ✅ Deploy successfully
2. ✅ Change admin password
3. ✅ Test thoroughly
4. ✅ Share with users
5. ⭐ Monitor Vercel/Supabase dashboards

---

**Need detailed help?** See `DEPLOYMENT_GUIDE.md`

**Having issues?** Check troubleshooting section in DEPLOYMENT_GUIDE.md
