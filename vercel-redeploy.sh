#!/bin/bash

echo "🚀 Force Redeploying to Vercel..."
echo "================================"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "📋 Current Environment Variables:"
echo "NEXT_PUBLIC_BACKEND_URL should be: https://31.220.81.177"
echo ""

# Login to Vercel if needed
echo "🔐 Ensuring Vercel authentication..."
vercel whoami || vercel login

echo ""
echo "🔧 Setting Environment Variables..."
# Set the correct backend URL
vercel env add NEXT_PUBLIC_BACKEND_URL production --force <<< "https://31.220.81.177"

echo ""
echo "🚀 Triggering Production Deployment..."
vercel --prod --force

echo ""
echo "✅ Deployment triggered!"
echo ""
echo "📝 Next Steps:"
echo "1. Wait for deployment to complete (2-3 minutes)"
echo "2. Clear browser cache (Cmd+Shift+R on Mac)"
echo "3. Test login at: https://www.drampa.ai/auth/sign-in"
echo "   Email: bruceoz@gmail.com"
echo "   Password: Ada1096754!!26"
echo ""
echo "🔍 To verify deployment:"
echo "curl -I https://www.drampa.ai | grep x-vercel-deployment-url"