# Investment Tracker - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+
- Supabase account ([supabase.com](https://supabase.com))

### 2. Clone & Install
```bash
git clone <repository-url>
cd investment-tracker
npm install
```

### 3. Supabase Setup
1. Create new Supabase project
2. Copy Project URL and API Key
3. Create `.env.local`:
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `migrations/run_all_migrations.sql`
3. Paste and execute

### 5. Start Development
```bash
npm run dev
```
Open http://localhost:5173

## ✅ Verification

After setup, you should be able to:
- [ ] Sign up with email/password
- [ ] Create a new SIP investment
- [ ] View portfolio dashboard
- [ ] Add withdrawal records

## 🔧 Optional: Google OAuth

For Google sign-in (recommended):
1. Follow `docs/GOOGLE_OAUTH_SETUP.md`
2. Configure Google Cloud Console
3. Update Supabase OAuth settings

## 📚 Documentation

- **Full README**: `README.md`
- **Database Migrations**: `migrations/README.md`
- **Development Plan**: `docs/DEVELOPMENT_PLAN.md`
- **Google OAuth Setup**: `docs/GOOGLE_OAUTH_SETUP.md`

## 🆘 Troubleshooting

### Common Issues

**PostCSS/Tailwind Errors**
- Already configured, should work out of the box

**Database Permission Errors**
- Ensure you're using Supabase admin access in SQL Editor

**Authentication Issues**
- Check environment variables in `.env.local`
- Verify Supabase project URL and keys

**Migration Errors**
- Use `migrations/run_all_migrations.sql` for new setups
- Run individual migrations in sequence for existing databases

### Getting Help

1. Check `docs/DEVELOPMENT_PLAN.md` for detailed implementation notes
2. Review `migrations/README.md` for database setup issues
3. Verify environment variables and Supabase configuration

## 🎯 Production Ready

This app is MVP-complete with:
- ✅ Secure authentication (email + Google OAuth)
- ✅ Complete SIP management with pause/resume
- ✅ Withdrawal tracking and portfolio analytics
- ✅ Mobile-responsive design
- ✅ Investment locking periods
- ✅ Real-time calculations and data isolation
