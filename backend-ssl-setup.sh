#!/bin/bash
# SSL Setup for DRAMPA Fashion AI Backend
# Run this on your production server (31.220.81.177)

echo "Setting up SSL certificate for DRAMPA Fashion AI backend..."

# Install Nginx and Certbot
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# Create domain name for your IP (if you don't have one)
# Option 1: Use a domain name like api.drampa.ai
# Option 2: Use a service like nip.io (e.g., api-31-220-81-177.nip.io)

# For now, let's set up a reverse proxy with nginx
sudo tee /etc/nginx/sites-available/drampa-api > /dev/null <<EOF
server {
    listen 80;
    listen 443 ssl http2;
    server_name 31.220.81.177;
    
    # SSL Configuration (self-signed for now)
    ssl_certificate /etc/ssl/certs/drampa-api.crt;
    ssl_certificate_key /etc/ssl/private/drampa-api.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Proxy to Node.js backend
    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "https://www.drampa.ai" always;
        add_header Access-Control-Allow-Origin "https://drampa.ai" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        # Handle preflight requests
        if (\$request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://www.drampa.ai" always;
            add_header Access-Control-Allow-Origin "https://drampa.ai" always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
            add_header Access-Control-Allow-Credentials "true" always;
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }
    }
}
EOF

# Generate self-signed certificate (temporary solution)
sudo mkdir -p /etc/ssl/private
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/drampa-api.key \
    -out /etc/ssl/certs/drampa-api.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=31.220.81.177"

# Enable the site
sudo ln -sf /etc/nginx/sites-available/drampa-api /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart nginx
sudo nginx -t && sudo systemctl restart nginx

# Enable nginx on boot
sudo systemctl enable nginx

echo "SSL setup complete! Backend now accessible via HTTPS."
echo "Note: Using self-signed certificate. For production, consider using a proper domain and Let's Encrypt."