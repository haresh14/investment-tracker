#!/bin/bash

# Investment Tracker - Quick Deployment Script
# This script helps prepare your app for deployment

echo "🚀 Investment Tracker - Deployment Preparation"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

echo "✅ Project directory confirmed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run TypeScript check
echo "🔍 Checking TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix TypeScript errors before deploying."
    exit 1
fi

echo "✅ Build successful"

# Test production build locally
echo "🧪 Testing production build..."
npm run preview &
PREVIEW_PID=$!
sleep 3

echo "✅ Production build test complete"
kill $PREVIEW_PID 2>/dev/null

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Investment Tracker MVP ready for deployment"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository exists"
fi

# Display next steps
echo ""
echo "🎉 Your Investment Tracker is ready for deployment!"
echo ""
echo "Next Steps:"
echo "1. Push your code to GitHub:"
echo "   git remote add origin https://github.com/yourusername/investment-tracker.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Sign in with GitHub"
echo "   - Import your repository"
echo "   - Add environment variables from .env.local"
echo "   - Deploy!"
echo ""
echo "3. ⚠️  CRITICAL: Configure Supabase (Required for authentication):"
echo "   - Keep Site URL as localhost (for shared instance)"
echo "   - Add production URLs to redirect URLs list"
echo "   - Update Google OAuth settings (if using)"
echo "   - Test login immediately after deployment"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo "📋 Use PRODUCTION_CHECKLIST.md to verify everything works"
echo ""
echo "🌟 Your app will be live at: https://your-app.vercel.app"
