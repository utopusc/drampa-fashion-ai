#!/bin/bash

echo "📁 Creating upload directories on server..."
cd /root/drampa-fashion-ai/backend
mkdir -p uploads/products
chmod 755 uploads
chmod 755 uploads/products

echo "✅ Server directories created"
echo ""

# Check if backend is running
pm2 status drampa-backend

# Restart backend
echo "🔄 Restarting backend..."
pm2 restart drampa-backend

echo ""
echo "📝 Testing upload endpoint..."
curl -X GET https://31.220.81.177/api/health

echo ""
echo "✅ Upload directories fixed!"
