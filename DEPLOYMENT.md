# DRAMPA Fashion AI - Deployment Guide

## 🚀 Quick Deployment

### Prerequisites
- Ubuntu server (20.04 or later)
- Root or sudo access
- SSH key configured for server access

### Step 1: Server Setup (First Time Only)

SSH into your server and run:

```bash
# Copy the server-setup.sh script to your server
scp server-setup.sh root@31.220.81.177:/root/

# SSH into the server
ssh root@31.220.81.177

# Run the setup script
chmod +x server-setup.sh
./server-setup.sh
```

This will install:
- Node.js 20.x
- MongoDB
- PM2 (Process Manager)
- Nginx (optional, for reverse proxy)

### Step 2: Deploy Application

From your local machine:

```bash
# Make sure you're in the project directory
cd /Users/burakcanozturk/Desktop/Projeler/drampa-fashion-ai

# Run the deployment script
./deploy-simple.sh
```

## 📋 Manual Deployment Steps

If the automatic deployment doesn't work, follow these manual steps:

### 1. Build the Application

```bash
npm run build
```

### 2. Upload Files to Server

```bash
# Create archive
tar -czf deploy.tar.gz .next public src Backend package.json package-lock.json next.config.js tailwind.config.js tsconfig.json ecosystem.config.js .env.production.local

# Upload to server
scp deploy.tar.gz root@31.220.81.177:/var/www/drampa-fashion-ai/

# SSH into server
ssh root@31.220.81.177
```

### 3. On the Server

```bash
cd /var/www/drampa-fashion-ai

# Extract files
tar -xzf deploy.tar.gz

# Copy environment files
cp .env.production.local .env.local
cp Backend/.env.production Backend/.env

# Install dependencies
npm install --production
cd Backend && npm install --production && cd ..

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local)**
```env
NEXT_PUBLIC_SUPABASE_URL=https://tqddcekpujhcbqgjgrhm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
NEXT_PUBLIC_BACKEND_URL=http://31.220.81.177:5001
FAL_KEY=your_fal_key
NEXT_PUBLIC_FASHN_API_KEY=your_fashn_key
```

**Backend (Backend/.env)**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/drampa-fashion
JWT_SECRET=drampa-super-secret-jwt-key-2024
FRONTEND_URL=http://31.220.81.177
FAL_API_KEY=your_fal_key
FASHN_API_KEY=your_fashn_key
```

## 🌐 Access Points

After successful deployment:

- **Frontend**: http://31.220.81.177:3001
- **Backend API**: http://31.220.81.177:5001
- **With Nginx**: http://31.220.81.177 (port 80)

## 📊 Server Management

### Check Application Status
```bash
pm2 status
```

### View Logs
```bash
# All logs
pm2 logs

# Frontend only
pm2 logs drampa-frontend

# Backend only
pm2 logs drampa-backend
```

### Restart Applications
```bash
# Restart all
pm2 restart all

# Restart specific
pm2 restart drampa-frontend
pm2 restart drampa-backend
```

### Stop Applications
```bash
pm2 stop all
```

### MongoDB Management
```bash
# Check status
systemctl status mongod

# Start/Stop/Restart
systemctl start mongod
systemctl stop mongod
systemctl restart mongod

# Access MongoDB shell
mongosh
```

## 🔍 Troubleshooting

### Application Not Starting
1. Check logs: `pm2 logs`
2. Verify MongoDB is running: `systemctl status mongod`
3. Check port availability: `netstat -tulpn | grep :3001`
4. Verify environment files exist

### Cannot Connect to MongoDB
```bash
# Start MongoDB
systemctl start mongod

# Enable auto-start
systemctl enable mongod
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 [PID]
```

### Build Errors
1. Clear Next.js cache: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules package-lock.json`
3. Reinstall: `npm install`
4. Rebuild: `npm run build`

## 🔒 Security Recommendations

1. **Use HTTPS**: Install SSL certificate with Let's Encrypt
2. **Configure Firewall**: Only allow necessary ports
3. **Regular Updates**: Keep system and dependencies updated
4. **Backup Database**: Regular MongoDB backups
5. **Monitor Logs**: Check for suspicious activity

## 📝 Update Deployment

To update the application:

1. Make changes locally
2. Test thoroughly
3. Run deployment script again: `./deploy-simple.sh`

## 🆘 Support

If you encounter issues:

1. Check the logs first: `pm2 logs`
2. Verify all services are running
3. Check environment variables are correct
4. Ensure MongoDB has enough storage space

## 📚 Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Last Updated**: August 2025
**Version**: 1.0.0