#\!/bin/bash

echo "🔐 Doğrudan IP ile SSL Çözümü"
echo "=============================="
echo ""
echo "DNS ayarı beklemeden hemen çalışan çözüm"
echo ""

# Server'da çalıştırılacak
cat << 'REMOTE' > server-direct-ssl.sh
#\!/bin/bash

echo "📦 Nginx yapılandırması güncelleniyor..."

# IP tabanlı SSL config
cat > /etc/nginx/sites-available/drampa-ssl << 'NGINX'
server {
    listen 443 ssl;
    server_name 31.220.81.177;
    
    # Mevcut self-signed sertifikayı kullan
    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;
    
    # Modern SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:\!aNULL:\!MD5;
    ssl_prefer_server_ciphers on;
    
    location / {
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
        add_header 'Access-Control-Allow-Origin' 'https://www.drampa.ai' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
    }
}

server {
    listen 80;
    server_name 31.220.81.177;
    return 301 https://$server_name$request_uri;
}
NGINX

ln -sf /etc/nginx/sites-available/drampa-ssl /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "✅ Nginx yeniden yapılandırıldı"

# Backend'in çalıştığından emin ol
pm2 restart drampa-backend || (cd /root/drampa-fashion-ai/backend && pm2 start server.js --name drampa-backend)
pm2 save

echo ""
echo "🎉 Hazır\!"
echo ""
echo "Test etmek için:"
echo "1. https://31.220.81.177/api/health adresini ziyaret edin"
echo "2. Sertifikayı kabul edin"
echo "3. drampa.ai'de login olun"
REMOTE

echo "📤 Script'i server'a gönderiyorum..."
scp -i ~/.ssh/id_ed25519_contabo server-direct-ssl.sh root@31.220.81.177:/root/

echo "🚀 Script'i çalıştırıyorum..."
ssh -i ~/.ssh/id_ed25519_contabo root@31.220.81.177 "bash /root/server-direct-ssl.sh"

echo ""
echo "✅ Tamamlandı\!"
echo ""
echo "📝 Kullanıcılara şu adımları söyleyin:"
echo "1. İlk defa https://31.220.81.177/api/health adresini açın"
echo "2. 'Advanced' > 'Proceed to 31.220.81.177' tıklayın"
echo "3. Artık drampa.ai'de giriş yapabilirsiniz"
