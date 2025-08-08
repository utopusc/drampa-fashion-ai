#!/bin/bash

# Backend SSL Setup Script for DRAMPA Fashion AI
# This script sets up HTTPS for the backend server

echo "🔐 Setting up SSL for DRAMPA Backend Server"
echo "==========================================="

# Server details
SERVER_IP="31.220.81.177"
DOMAIN="api.drampa.ai"  # You can use a subdomain

echo "📋 Configuration:"
echo "- Server: $SERVER_IP"
echo "- Domain: $DOMAIN (optional)"
echo ""

# Install required packages
echo "📦 Installing required packages..."
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

# Stop any existing nginx
systemctl stop nginx 2>/dev/null || true

# Create nginx configuration
echo "⚙️ Configuring Nginx reverse proxy..."
cat > /etc/nginx/sites-available/drampa-backend << 'EOF'
server {
    listen 80;
    server_name 31.220.81.177 api.drampa.ai;

    # API endpoints
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
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '$http_origin' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '$http_origin' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }

    # Static files (if any)
    location /uploads {
        proxy_pass http://localhost:5001/uploads;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS for static files
        add_header 'Access-Control-Allow-Origin' '*' always;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/drampa-backend /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "🔍 Testing Nginx configuration..."
nginx -t

# Start nginx
echo "🚀 Starting Nginx..."
systemctl start nginx
systemctl enable nginx

# Option 1: Self-signed certificate (for immediate use)
echo "🔒 Generating self-signed SSL certificate..."
mkdir -p /etc/ssl/certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/drampa-backend.key \
    -out /etc/ssl/certs/drampa-backend.crt \
    -subj "/C=US/ST=State/L=City/O=DRAMPA/CN=$SERVER_IP"

# Update nginx config for SSL
cat > /etc/nginx/sites-available/drampa-backend-ssl << 'EOF'
server {
    listen 443 ssl http2;
    server_name 31.220.81.177 api.drampa.ai;

    ssl_certificate /etc/ssl/certs/drampa-backend.crt;
    ssl_certificate_key /etc/ssl/private/drampa-backend.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # API endpoints
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
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '$http_origin' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '$http_origin' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }

    # Static files
    location /uploads {
        proxy_pass http://localhost:5001/uploads;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        add_header 'Access-Control-Allow-Origin' '*' always;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name 31.220.81.177 api.drampa.ai;
    return 301 https://$server_name$request_uri;
}
EOF

# Enable SSL site
ln -sf /etc/nginx/sites-available/drampa-backend-ssl /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/drampa-backend

# Reload nginx
echo "🔄 Reloading Nginx with SSL..."
nginx -t && systemctl reload nginx

echo ""
echo "✅ SSL Setup Complete!"
echo ""
echo "📋 Access URLs:"
echo "- HTTP:  http://$SERVER_IP/api"
echo "- HTTPS: https://$SERVER_IP/api (self-signed cert)"
echo ""
echo "⚠️  IMPORTANT:"
echo "1. Update your frontend to use: https://$SERVER_IP"
echo "2. For production, get a proper SSL certificate:"
echo "   - Point api.drampa.ai to $SERVER_IP"
echo "   - Run: certbot --nginx -d api.drampa.ai"
echo ""
echo "🔍 Test the setup:"
echo "curl -k https://$SERVER_IP/api/health"
echo "curl -k https://$SERVER_IP/api/auth/login -X POST -H 'Content-Type: application/json' -d '{\"email\":\"bruceoz@gmail.com\",\"password\":\"Ada1096754!!26\"}'"