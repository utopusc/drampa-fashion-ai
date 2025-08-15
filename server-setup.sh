#!/bin/bash

echo "========================================"
echo "🛠️  DRAMPA Server Setup Script"
echo "========================================"
echo ""
echo "This script will set up your server with:"
echo "- Node.js and npm"
echo "- MongoDB"
echo "- PM2 process manager"
echo "- Nginx (optional)"
echo ""

# Update system
echo "📦 Updating system packages..."
apt-get update && apt-get upgrade -y

# Install Node.js 20.x
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify Node.js installation
node_version=$(node --version)
npm_version=$(npm --version)
echo "✅ Node.js installed: $node_version"
echo "✅ npm installed: $npm_version"

# Install MongoDB
echo "📦 Installing MongoDB..."
apt-get install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt-get update
apt-get install -y mongodb-org

# Start MongoDB
echo "🚀 Starting MongoDB..."
systemctl start mongod
systemctl enable mongod
systemctl status mongod --no-pager

# Install PM2
echo "📦 Installing PM2..."
npm install -g pm2

# Install build essentials (for native modules)
echo "📦 Installing build essentials..."
apt-get install -y build-essential

# Create project directory
echo "📁 Creating project directory..."
mkdir -p /var/www/drampa-fashion-ai

# Install Nginx (optional)
read -p "Do you want to install Nginx for reverse proxy? (y/n): " install_nginx

if [ "$install_nginx" = "y" ]; then
    echo "📦 Installing Nginx..."
    apt-get install -y nginx
    
    # Create Nginx configuration
    cat > /etc/nginx/sites-available/drampa << 'EOF'
server {
    listen 80;
    server_name _;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
    
    # Enable the site
    ln -sf /etc/nginx/sites-available/drampa /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload Nginx
    nginx -t
    systemctl reload nginx
    systemctl enable nginx
    
    echo "✅ Nginx installed and configured!"
    echo "   Your app will be available at: http://YOUR_SERVER_IP"
else
    echo "⚠️  Nginx not installed. Your app will run on ports 3001 and 5001"
fi

# Configure firewall
echo "🔒 Configuring firewall..."
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 3001/tcp  # Next.js
ufw allow 5001/tcp  # Backend
ufw --force enable

echo ""
echo "========================================"
echo "✅ SERVER SETUP COMPLETE!"
echo "========================================"
echo ""
echo "Installed components:"
echo "✅ Node.js: $node_version"
echo "✅ npm: $npm_version"
echo "✅ MongoDB: Running"
echo "✅ PM2: Installed"
[ "$install_nginx" = "y" ] && echo "✅ Nginx: Running"
echo ""
echo "Next steps:"
echo "1. Run the deployment script: ./deploy-simple.sh"
echo "2. Your application will be available at:"
[ "$install_nginx" = "y" ] && echo "   http://YOUR_SERVER_IP" || echo "   http://YOUR_SERVER_IP:3001"
echo ""
echo "Useful commands:"
echo "- Check MongoDB: systemctl status mongod"
echo "- Check PM2 apps: pm2 status"
[ "$install_nginx" = "y" ] && echo "- Check Nginx: systemctl status nginx"
echo "- View logs: pm2 logs"
echo ""