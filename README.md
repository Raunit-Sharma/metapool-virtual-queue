# 🎯 METAPOOL Virtual Queue System

A modern, mobile-responsive virtual queue management system built with React, TypeScript, Tailwind CSS, and Supabase. Perfect for managing queues at events, offices, or any venue requiring organized queue management.

## ✨ Features

### 🔓 Public Queue View
- **Real-time Queue Display** - See the entire queue in real-time
- **Current Player Highlight** - Prominently displays who's currently being served
- **Next in Line** - Shows who's up next
- **Auto-refresh** - Updates every 10 seconds automatically
- **Mobile Responsive** - Perfect display on phones, tablets, and desktops
- **No Login Required** - Anyone can view the queue status

### 🔐 Admin Dashboard
- **Secure Authentication** - Email/password login for admins
- **Add Participants** - Register new participants with name and roll number
- **Token Management** - Auto-assigned sequential token numbers
- **Advance Queue** - Mark current participant as completed and call next
- **Queue Statistics** - Real-time stats on total, current, and waiting participants
- **Multiple Admin Support** - Support for multiple admin accounts
- **Session Persistence** - Stays logged in across page refreshes

### 📱 Mobile-First Design
- Fully responsive layouts optimized for mobile devices
- Touch-friendly interface
- Optimized font sizes and spacing for all screen sizes
- Hidden columns on mobile for better UX

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Supabase account ([supabase.com](https://supabase.com))

### 1. Clone & Install

```bash
cd "d:\Raunit\Projects\METAPOOL Virtual Queue"
npm install
```

### 2. Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to initialize

2. **Get Your Credentials**
   - Go to Settings → API
   - Copy your **Project URL** and **Anon/Public Key**

3. **Update Environment Variables**
   - Open `.env` file
   - Replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=your_actual_supabase_url
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key
   ```

### 3. Run Database Migration

1. **Go to SQL Editor** in Supabase dashboard
2. **Copy the entire contents** of `supabase/migrations/20251103073529_create_metapool_schema.sql`
3. **Paste and Run** the SQL script
4. Verify tables are created: `admin_users`, `participants`, `queue_settings`

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## 🎮 Usage Guide

### For Public Users (Anyone)
1. **Open the website** - No login required
2. **View the queue** - See all participants and current status
3. **Check your position** - Find your token number in the list
4. **Auto-updates** - Page refreshes every 10 seconds

### For Admins

#### First Time Login
- **Email:** `admin@metapool.com`
- **Password:** `admin123`
- ⚠️ **Important:** Change this password in production!

#### Admin Actions
1. **Click the Admin button** (floating button bottom-right)
2. **Login** with admin credentials
3. **Add Participant:**
   - Click "Add Participant"
   - Enter name and roll number
   - Click "Register"
4. **Advance Queue:**
   - When current participant is done, click "Call Next"
   - This moves the queue forward

## 📁 Project Structure

```
METAPOOL Virtual Queue/
├── src/
│   ├── components/
│   │   ├── AdminDashboard.tsx    # Admin management interface
│   │   ├── AdminLogin.tsx        # Admin login page
│   │   └── PublicQueue.tsx       # Public queue viewer
│   ├── lib/
│   │   ├── auth.ts               # Authentication logic
│   │   └── supabase.ts           # Supabase client & types
│   ├── App.tsx                   # Main app routing
│   ├── main.tsx                  # App entry point
│   └── index.css                 # Tailwind styles
├── supabase/
│   └── migrations/
│       └── 20251103073529_create_metapool_schema.sql
├── .env                          # Environment variables (YOUR CREDENTIALS)
├── .env.example                  # Environment template
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🗄️ Database Schema

### Tables

**admin_users**
- `id` - UUID primary key
- `email` - Unique admin email
- `password_hash` - Password (plain text for demo)
- `name` - Admin display name
- `created_at` - Account creation timestamp

**participants**
- `id` - UUID primary key
- `token_number` - Auto-incrementing token (unique)
- `name` - Participant name
- `roll_no` - Roll number (unique)
- `registered_at` - Registration timestamp
- `status` - Status (waiting/called/completed)

**queue_settings**
- `id` - Always 1 (singleton)
- `current_token` - Currently served token number
- `updated_at` - Last update timestamp
- `updated_by` - Admin who updated

## 🔧 Configuration

### Adding New Admins

Run this SQL in Supabase SQL Editor:

```sql
INSERT INTO admin_users (email, password_hash, name)
VALUES ('newemail@example.com', 'newpassword', 'Admin Name');
```

### Resetting the Queue

```sql
-- Reset current token to 0
UPDATE queue_settings SET current_token = 0 WHERE id = 1;

-- Clear all participants
DELETE FROM participants;

-- Reset token sequence
ALTER SEQUENCE token_number_seq RESTART WITH 1;
```

## 🚀 Deployment

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Deploy!

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag & drop the `dist` folder to [netlify.com/drop](https://app.netlify.com/drop)
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run typecheck
```

## 🔒 Security Notes

### ⚠️ Important for Production

1. **Change Default Admin Password**
   ```sql
   UPDATE admin_users 
   SET password_hash = 'your_new_secure_password'
   WHERE email = 'admin@metapool.com';
   ```

2. **Implement Proper Password Hashing**
   - Current implementation stores plain text passwords
   - For production, implement bcrypt or similar on a backend

3. **Enable Row Level Security (RLS)**
   - Already enabled in migration
   - Public can read queue data
   - Only authenticated users can modify data

4. **Use Environment Variables**
   - Never commit `.env` file
   - Use your hosting platform's environment variable settings

## 📱 Mobile Optimization

The app is optimized for mobile with:
- Responsive breakpoints (sm, md, lg)
- Touch-friendly button sizes
- Optimized font scaling
- Hidden non-essential columns on mobile
- Smooth scrolling and transitions

## 🐛 Troubleshooting

### "Missing Supabase environment variables" Error
- Check that `.env` file exists
- Verify variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after changing `.env`

### Database Connection Failed
- Verify Supabase credentials are correct
- Check that migration script ran successfully
- Ensure RLS policies are enabled

### Participants Not Showing
- Check Supabase → Table Editor → participants
- Verify public read access in RLS policies
- Check browser console for errors

### Admin Can't Login
- Verify admin exists in `admin_users` table
- Check email and password match exactly
- Look for errors in browser console

## 📄 License

This project is open source and available for personal and commercial use.

## 👨‍💻 Support

For issues or questions:
1. Check this README thoroughly
2. Review Supabase dashboard for errors
3. Check browser console for error messages
4. Verify all migration scripts ran successfully

## 🎉 Features Roadmap

Potential future enhancements:
- [ ] SMS notifications for participants
- [ ] QR code generation for tokens
- [ ] Multiple queue support
- [ ] Analytics dashboard
- [ ] Export queue history
- [ ] Custom branding
- [ ] Sound notifications
- [ ] Multi-language support

---

**Built with ❤️ using React, TypeScript, Tailwind CSS, and Supabase**
