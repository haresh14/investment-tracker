# Investment Tracker - Deployment Guide

## 🚀 Free Deployment Setup

This guide walks you through deploying the Investment Tracker using completely free services.

### 🎯 Quick Reference - Post-Deployment Checklist

After deploying to Vercel, **IMMEDIATELY** update these settings or authentication will fail:

1. **Supabase**: Add production URLs to redirect URLs list (keep Site URL as localhost for shared instance)
2. **Google OAuth**: Add Vercel domain to authorized origins (if using Google login)
3. **Test**: Verify signup/login works on production

**💡 For Shared Supabase Instance**: Keep Site URL as `http://localhost:5173` and add production URLs to redirect URLs list

📍 **Detailed instructions in Step 3 and Post-Deployment section below**

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

⚠️ **CRITICAL**: After deployment, you MUST update Supabase settings or authentication will fail!

### 3.1 Get Your Vercel Domain

After deployment, Vercel provides your app URL:
- **Automatic domain**: `https://your-project-name.vercel.app`
- **Custom domain** (if configured): `https://yourdomain.com`

### 3.2 Update Supabase Authentication Settings

**🔗 Navigate to Supabase Dashboard:**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration**

**📝 Site URL Configuration:**

**Option A: Shared Instance (Recommended)**
If using the same Supabase instance for local development AND production:
```
Site URL: http://localhost:5173
```
*Keep your local development URL as the main Site URL*

**Option B: Production Only**
If using separate Supabase instances:
```
Site URL: https://your-project-name.vercel.app
```

**📝 Add Redirect URLs:**
Add ALL these URLs to support both local development and production:
```
http://localhost:5173
http://localhost:5173/
http://localhost:5173/dashboard
http://localhost:5173/**
https://your-project-name.vercel.app
https://your-project-name.vercel.app/
https://your-project-name.vercel.app/dashboard
https://your-project-name.vercel.app/**
```

**💡 Pro Tip**: 
- The Site URL is the **primary** redirect after authentication
- Redirect URLs list allows **additional** valid redirect destinations
- You can have multiple domains in the redirect URLs list
- The `/**` wildcard allows all routes under each domain

### 3.3 Update Google OAuth (if configured)

If you set up Google OAuth, update your **Google Cloud Console**:

**🔗 Navigate to Google Cloud Console:**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Edit your OAuth 2.0 Client ID

**📝 Update Authorized JavaScript Origins:**
Add BOTH local development and production domains:
```
http://localhost:5173
https://your-project-name.vercel.app
```

**📝 Authorized Redirect URIs:**
Keep the Supabase callback URL (don't change this):
```
https://your-supabase-project-id.supabase.co/auth/v1/callback
```

### 3.4 Test Authentication After Configuration

**✅ Immediate Test Checklist:**
1. Visit your deployed app
2. Try signing up with a new email
3. Try logging in with existing credentials
4. Test Google OAuth (if configured)
5. Verify user can access dashboard after login

**🚨 Common Issues:**
- **"Invalid login credentials"**: Check Site URL in Supabase
- **OAuth redirect errors**: Verify redirect URLs match exactly
- **Google OAuth fails**: Check Google Cloud Console settings

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

## 🎯 Post-Deployment Configuration (REQUIRED)

### ⚠️ CRITICAL: Complete These Steps Immediately After Deployment

Your app is deployed but **authentication will NOT work** until you complete these configurations:

#### 1. **Update Supabase Redirect URLs** (Required for production authentication)
```bash
# Add your production URL to redirect URLs (example)
https://investment-tracker-abc123.vercel.app
```

**Steps:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **Authentication** → **URL Configuration**
3. **Keep Site URL as localhost** (for shared instance)
4. **Add production URLs** to Redirect URLs list (see Step 3.2 above)

#### 2. **Update Google OAuth** (If you configured Google login)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials** → Edit OAuth Client
3. Add your Vercel domain to **Authorized JavaScript origins**

#### 3. **Test Authentication Immediately**
- [ ] Sign up with new email works
- [ ] Login with existing account works  
- [ ] Google OAuth works (if configured)
- [ ] User can access dashboard after login

### 🚨 If Authentication Fails

**Common Error Messages & Solutions:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid login credentials" | Missing production URLs in redirect list | Add production URLs to Supabase redirect URLs |
| "OAuth redirect error" | Missing redirect URLs | Add all redirect URLs in Supabase |
| "Google OAuth fails" | Wrong origins in Google Console | Add Vercel domain to Google OAuth |
| "Access denied" | RLS policies not working | Verify database migrations ran |

### 📞 Need Help?
If authentication still doesn't work:
1. Check browser console for errors
2. Verify all URLs match exactly (no trailing slashes)
3. Wait 2-3 minutes for DNS propagation
4. Try incognito/private browsing mode

---

## 🎉 Deployment Complete!

Your Investment Tracker is now live and accessible to users worldwide!

**Free Tier Limits**:
- **Vercel**: 100GB bandwidth/month, unlimited projects
- **Supabase**: 500MB database, 50MB storage, 50,000 monthly active users

**Next Steps**:
- ✅ Complete post-deployment configuration above
- 📱 Test on mobile devices
- 👥 Share your app with users
- 📊 Monitor usage and performance
- 🚀 Plan for scaling if needed
- 💡 Consider premium features for growth
