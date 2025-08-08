#!/bin/bash

echo "🔐 Let's Encrypt SSL Kurulumu"
echo "=============================="
echo ""
echo "Bu script api.drampa.ai için gerçek SSL sertifikası kuracak"
echo ""

# Server'da çalıştırılacak komutlar
cat << 'SCRIPT' > server-letsencrypt.sh
#!/bin/bash

# 1. Domain'i DNS'e ekleyin
echo "📋 ÖNCE YAPMANIZ GEREKENLER:"
echo "1. DNS ayarlarına gidin (Cloudflare, Namecheap, vs)"
echo "2. Yeni A record ekleyin:"
echo "   Name: api"
echo "   Value: 31.220.81.177"
echo "   TTL: Auto"
echo ""
echo "DNS yayılması için 5-10 dakika bekleyin..."
echo "Hazır olduğunuzda Enter'a basın..."
read

# 2. Certbot ile SSL al
apt-get update
apt-get install -y certbot python3-certbot-nginx

# 3. Nginx config güncelle
cat > /etc/nginx/sites-available/drampa-api << 'EOF'
server {
    listen 80;
    server_name api.drampa.ai;
    
    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 4. Site'i aktif et
ln -sf /etc/nginx/sites-available/drampa-api /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/drampa-backend-ssl
nginx -t && systemctl reload nginx

# 5. SSL sertifikası al
certbot --nginx -d api.drampa.ai --non-interactive --agree-tos --email admin@drampa.ai --redirect

# 6. Auto-renewal ayarla
(crontab -l 2>/dev/null; echo "0 0 * * * certbot renew --quiet") | crontab -

echo "✅ SSL Kurulumu Tamamlandı!"
echo ""
echo "🎉 Yeni Backend URL: https://api.drampa.ai"
echo ""
echo "Vercel'de güncelleme yapın:"
echo "NEXT_PUBLIC_BACKEND_URL = https://api.drampa.ai"
SCRIPT

echo "📝 Kurulum Adımları:"
echo "1. DNS'e api.drampa.ai → 31.220.81.177 A record ekleyin"
echo "2. SSH ile server'a bağlanın:"
echo "   ssh -i ~/.ssh/id_ed25519_contabo root@31.220.81.177"
echo "3. Script'i çalıştırın:"
echo "   bash server-letsencrypt.sh"
echo "4. Vercel environment variable güncelle:"
echo "   NEXT_PUBLIC_BACKEND_URL = https://api.drampa.ai"
echo "5. Vercel'i redeploy edin"