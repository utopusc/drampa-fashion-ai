#\!/bin/bash

echo "🔐 Let's Encrypt SSL Kurulumu - Basitleştirilmiş"
echo "================================================"
echo ""

# Server'a bağlanıp çalıştırılacak script
cat << 'REMOTE_SCRIPT' > remote-letsencrypt.sh
#\!/bin/bash

echo "📦 Certbot kurulumu..."
apt-get update
apt-get install -y certbot python3-certbot-nginx

echo ""
echo "🔧 Nginx yapılandırması..."

# Önce mevcut SSL config'i temizle
rm -f /etc/nginx/sites-enabled/drampa-backend-ssl
rm -f /etc/nginx/sites-available/drampa-backend-ssl

# Basit HTTP config oluştur (certbot için)
cat > /etc/nginx/sites-available/drampa-api << 'NGINX'
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
NGINX

# Site'i aktif et
ln -sf /etc/nginx/sites-available/drampa-api /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo ""
echo "🎯 SSL sertifikası alınıyor..."
certbot --nginx -d api.drampa.ai --non-interactive --agree-tos --email admin@drampa.ai --redirect

echo ""
echo "⏰ Otomatik yenileme ayarlanıyor..."
(crontab -l 2>/dev/null; echo "0 0 * * * certbot renew --quiet") | crontab -

echo ""
echo "✅ Kurulum tamamlandı\!"
echo ""
echo "🎉 Yeni API URL: https://api.drampa.ai"
echo ""
echo "📝 Şimdi yapmanız gerekenler:"
echo "1. Vercel'de NEXT_PUBLIC_BACKEND_URL = https://api.drampa.ai olarak güncelleyin"
echo "2. Vercel'i yeniden deploy edin"
REMOTE_SCRIPT

echo "📋 ADIM 1: DNS Ayarları"
echo "========================"
echo ""
echo "Cloudflare veya DNS yöneticinize gidin ve şu kaydı ekleyin:"
echo ""
echo "  Type: A"
echo "  Name: api"
echo "  Value: 31.220.81.177"
echo "  TTL: Auto (veya 1 min)"
echo ""
echo "DNS kaydını ekledikten sonra Enter'a basın..."
read

echo ""
echo "🔍 DNS kontrolü yapılıyor..."
nslookup api.drampa.ai 8.8.8.8 2>/dev/null | grep -A1 "Name:" || echo "⚠️  DNS henüz yayılmamış olabilir"

echo ""
echo "📋 ADIM 2: Server'a Script Kopyalama"
echo "===================================="
echo ""
echo "Script'i server'a kopyalıyorum..."
scp -i ~/.ssh/id_ed25519_contabo remote-letsencrypt.sh root@31.220.81.177:/root/

echo ""
echo "📋 ADIM 3: Script'i Çalıştırma"
echo "=============================="
echo ""
echo "Server'da script'i çalıştırıyorum..."
ssh -i ~/.ssh/id_ed25519_contabo root@31.220.81.177 "bash /root/remote-letsencrypt.sh"

echo ""
echo "🎉 İşlem tamamlandı\!"
echo ""
echo "📝 Son adımlar:"
echo "1. Vercel dashboard'a gidin"
echo "2. Settings > Environment Variables"
echo "3. NEXT_PUBLIC_BACKEND_URL = https://api.drampa.ai olarak güncelleyin"
echo "4. Redeploy yapın"
