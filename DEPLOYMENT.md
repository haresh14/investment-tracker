# Investment Tracker - Deployment Guide

## 🚀 Free Deployment Setup

This guide walks you through deploying the Investment Tracker using completely free services.

### Prerequisites

- ✅ Supabase project set up and running
- ✅ All database migrations completed
- ✅ Local development working properly
- ✅ GitHub account (for Vercel deployment)

### Deployment Stack (100% Free)

- **Frontend Hosting**: Vercel (Free tier)
- **Backend**: Supabase (Free tier) 
- **Domain**: `your-app.vercel.app` (Free Vercel domain)
- **SSL Certificate**: Automatic (Free with Vercel)

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit - Investment Tracker MVP"

# Add GitHub remote and push
git remote add origin https://github.com/yourusername/investment-tracker.git
git branch -M main
git push -u origin main
```

### 1.2 Verify Build

Ensure your production build works:

```bash
npm run build
npm run preview
```

## Step 2: Deploy to Vercel

### 2.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account (free)
3. Authorize Vercel to access your repositories

### 2.2 Deploy Your App

**Option A: Vercel Dashboard**
1. Click "New Project" in Vercel dashboard
2. Import your `investment-tracker` repository
3. Vercel will auto-detect it's a Vite project
4. Click "Deploy"

**Option B: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: investment-tracker
# - Directory: ./
# - Override settings? No
```

### 2.3 Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add these variables:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: Use the same values from your local `.env.local` file.

### 2.4 Redeploy with Environment Variables

After adding environment variables:
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

## Step 3: Configure Supabase for Production

### 3.1 Update Supabase Auth Settings

In Supabase Dashboard → Authentication → URL Configuration:

**Site URL**: `https://your-app.vercel.app`

**Redirect URLs**: Add these URLs:
```
https://your-app.vercel.app
https://your-app.vercel.app/dashboard
https://your-app.vercel.app/**
```

### 3.2 Update Google OAuth (if using)

If you set up Google OAuth, update your Google Cloud Console:

**Authorized JavaScript origins**:
```
https://your-app.vercel.app
```

**Authorized redirect URIs**:
```
https://your-supabase-project.supabase.co/auth/v1/callback
```

## Step 4: Test Production Deployment

### 4.1 Basic Functionality Test

Visit your deployed app and test:
- [ ] App loads without errors
- [ ] Sign up with new email works
- [ ] Login with existing account works
- [ ] Google OAuth works (if configured)
- [ ] Create new SIP works
- [ ] Dashboard displays correctly
- [ ] Mobile responsiveness works

### 4.2 Feature Testing Checklist

**Authentication**:
- [ ] Email/password signup
- [ ] Email/password login
- [ ] Google OAuth (if configured)
- [ ] User switching and cache clearing
- [ ] Logout functionality

**SIP Management**:
- [ ] Create new SIP with all fields
- [ ] Edit existing SIP
- [ ] Pause/Resume SIP with date selection
- [ ] Delete SIP
- [ ] View SIP details page

**Portfolio Features**:
- [ ] Portfolio summary calculations
- [ ] Withdrawal management
- [ ] Available vs locked amounts
- [ ] Mobile responsive layout

## Step 5: Custom Domain (Optional - Free)

### 5.1 Free Domain Options

**Option A: Vercel Free Domain**
- Your app is available at `your-app.vercel.app`
- No additional setup needed
- Professional and reliable

**Option B: Free Custom Domain**
- Get free domain from [Freenom](http://freenom.com) (.tk, .ml, .ga, .cf)
- Or use [GitHub Student Pack](https://education.github.com/pack) for free .me domain

### 5.2 Configure Custom Domain in Vercel

If you have a custom domain:
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Supabase redirect URLs to use new domain

## Step 6: Monitoring and Maintenance

### 6.1 Vercel Analytics (Free)

Enable free analytics in Vercel:
1. Project Settings → Analytics
2. Enable Web Analytics
3. View performance metrics

### 6.2 Supabase Monitoring

Monitor your Supabase usage:
1. Supabase Dashboard → Settings → Usage
2. Keep track of database size and API calls
3. Free tier limits: 500MB database, 50MB file storage

### 6.3 Automatic Deployments

Vercel automatically deploys when you push to main branch:
```bash
# Make changes and push
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys the changes
```

## Troubleshooting

### Common Issues

**Build Failures**:
- Check TypeScript errors: `npm run build`
- Verify all dependencies are in `package.json`
- Check Vercel build logs

**Environment Variables Not Working**:
- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check variable names match exactly

**Authentication Issues**:
- Verify Supabase URL configuration
- Check redirect URLs in Supabase settings
- Ensure environment variables are correct

**Database Connection Issues**:
- Verify Supabase project is active
- Check RLS policies are enabled
- Ensure migrations were run successfully

### Getting Help

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify Supabase project status
4. Test locally with production build

## 🎉 Deployment Complete!

Your Investment Tracker is now live and accessible to users worldwide!

**Free Tier Limits**:
- **Vercel**: 100GB bandwidth/month, unlimited projects
- **Supabase**: 500MB database, 50MB storage, 50,000 monthly active users

**Next Steps**:
- Share your app with users
- Monitor usage and performance
- Plan for scaling if needed
- Consider premium features for growth
