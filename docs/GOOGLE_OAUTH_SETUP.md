# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Investment Tracker app.

## Prerequisites

- Supabase project created and configured
- Google Cloud Console account

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make sure the project is selected in the top dropdown

### 1.2 Enable Google+ API
1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API" 
3. Click on it and press **Enable**

### 1.3 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen first:
   - Choose **External** user type
   - Fill in required fields:
     - App name: "Investment Tracker"
     - User support email: Your email
     - Developer contact email: Your email
   - Save and continue through all steps

4. Create OAuth client ID:
   - Application type: **Web application**
   - Name: "Investment Tracker Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `https://your-domain.vercel.app` (for production - add later)
   - Authorized redirect URIs:
     - `https://your-supabase-project.supabase.co/auth/v1/callback`

5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Supabase

### 2.1 Add Google Provider
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list and click to configure
4. Enable the Google provider
5. Enter your Google OAuth credentials:
   - **Client ID**: Paste from Google Cloud Console
   - **Client Secret**: Paste from Google Cloud Console
6. Click **Save**

### 2.2 Update Site URL (if needed)
1. Go to **Authentication** → **Settings**
2. Make sure **Site URL** is set to:
   - Development: `http://localhost:5173`
   - Production: `https://your-domain.vercel.app`
3. Add redirect URLs:
   - `http://localhost:5173/**`
   - `https://your-domain.vercel.app/**`

## Step 3: Test Google OAuth

### 3.1 Development Testing
1. Start your development server: `npm run dev`
2. Go to `http://localhost:5173/login`
3. Click "Continue with Google"
4. Should redirect to Google login
5. After successful login, should redirect back to your app

### 3.2 Troubleshooting

**Common Issues:**

1. **"redirect_uri_mismatch" error**
   - Check that your redirect URI in Google Cloud Console exactly matches: `https://your-supabase-project.supabase.co/auth/v1/callback`
   - Make sure there are no extra spaces or characters

2. **"unauthorized_client" error**
   - Verify Client ID and Client Secret are correct
   - Make sure the OAuth consent screen is configured

3. **"access_denied" error**
   - Check that the user has permission to access the app
   - Verify OAuth consent screen settings

## Step 4: Production Setup

When deploying to production:

1. **Update Google Cloud Console:**
   - Add production domain to Authorized JavaScript origins
   - Add production redirect URI

2. **Update Supabase:**
   - Update Site URL to production domain
   - Add production redirect URLs

## Environment Variables

No additional environment variables are needed for Google OAuth. Supabase handles the OAuth configuration through the dashboard.

## Security Notes

- Keep your Client Secret secure and never expose it in frontend code
- Regularly rotate your OAuth credentials
- Monitor OAuth usage in Google Cloud Console
- Set up proper scopes (Supabase handles basic profile and email scopes automatically)

## Testing Checklist

- [ ] Google OAuth credentials created
- [ ] Supabase Google provider configured
- [ ] Site URLs and redirect URIs configured
- [ ] Development login works
- [ ] User data is properly stored in Supabase
- [ ] Logout functionality works
- [ ] Production deployment configured (when ready)

## Support

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Check browser developer console for errors
3. Verify all URLs and credentials are correct
4. Test with a different Google account
