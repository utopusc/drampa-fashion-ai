# DRAMPA Fashion AI - Deployment Commands

## Sunucuya Kurulum Komutları

Aşağıdaki komutları sırasıyla çalıştırın:

### 1. Sunucuya Script'i Kopyalama
```bash
# Terminal'de (local bilgisayarınızda) çalıştırın:
scp server-setup.sh root@31.220.81.177:/root/
```

### 2. Sunucuya Bağlanma
```bash
ssh root@31.220.81.177
```

### 3. Script'i Çalıştırma
```bash
# Sunucuda çalıştırın:
chmod +x /root/server-setup.sh
bash /root/server-setup.sh
```

## Alternatif: Manuel Kurulum

Eğer script ile sorun yaşarsanız, manuel olarak şu komutları çalıştırın:

```bash
# Sunucuya bağlanın
ssh root@31.220.81.177

# Sistemi güncelleyin
apt update && apt upgrade -y

# Nginx kurulumu
apt install -y nginx

# Node.js 20 kurulumu
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2 kurulumu
npm install -g pm2

# Proje dizinini oluşturun
mkdir -p /var/www/drampa-fashion-ai
cd /var/www/drampa-fashion-ai

# Repository'yi klonlayın
git clone https://github.com/utopusc/drampa-fashion-ai.git .

# Dependencies kurulumu
npm install
cd Backend && npm install && cd ..

# Frontend build
npm run build

# Environment dosyaları oluşturma
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://vhxqknhrowydzrbcomdt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoeHFrbmhyb3d5ZHpyYmNvbWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MDQ5MDMsImV4cCI6MjA0NzQ4MDkwM30.xjTc3YwPDnoe4gv3w94shvMj8pLKaONIvaB0VmQfCII
NEXT_PUBLIC_BACKEND_URL=https://drampa.ai
FAL_KEY=890e21e4-b089-4087-a519-7ba2f31eb645:004a3e4db31a7790cb642f4fe0d00222
EOF

cat > Backend/.env << 'EOF'
PORT=5001
MONGODB_URI=mongodb://localhost:27017/drampa-production
JWT_SECRET=drampa-secret-key-production-2024-secure-random-string
FRONTEND_URL=https://drampa.ai
FAL_API_KEY=890e21e4-b089-4087-a519-7ba2f31eb645:004a3e4db31a7790cb642f4fe0d00222
NODE_ENV=production
EOF

# PM2 ile uygulamaları başlatma
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Nginx Yapılandırması

```bash
# Nginx config dosyasını oluşturun
nano /etc/nginx/sites-available/drampa
```

Aşağıdaki içeriği yapıştırın (nano'da CTRL+SHIFT+V):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name drampa.ai www.drampa.ai;

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

    location /_next/static {
        proxy_pass http://localhost:3001;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, immutable";
    }

    location /uploads {
        alias /var/www/drampa-fashion-ai/Backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 50M;
}
```

CTRL+X, Y, Enter ile kaydedin.

```bash
# Site'i aktif edin
ln -s /etc/nginx/sites-available/drampa /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Nginx'i test edin ve yeniden başlatın
nginx -t
systemctl restart nginx
systemctl enable nginx

# Firewall ayarları
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable
```

## Kontrol Komutları

```bash
# PM2 durumunu kontrol et
pm2 status

# Logları görüntüle
pm2 logs drampa-frontend
pm2 logs drampa-backend

# Nginx durumu
systemctl status nginx

# Port kontrolü
netstat -tulpn | grep -E ':(80|443|3001|5001)'
```

## Cloudflare SSL Ayarları

1. Cloudflare Dashboard'a gidin
2. SSL/TLS > Overview
3. **"Flexible"** modunu seçin (başlangıç için)
4. DNS kayıtlarında proxy'nin aktif olduğundan emin olun (turuncu bulut)

## Test

Tarayıcınızda şu adresleri test edin:
- https://drampa.ai
- https://www.drampa.ai
- https://api.drampa.ai/api/test

## Sorun Giderme

### PM2 servisleri çalışmıyorsa:
```bash
cd /var/www/drampa-fashion-ai
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

### Nginx hatası varsa:
```bash
nginx -t  # Hataları gösterir
journalctl -u nginx -n 50  # Son 50 log satırı
```

### Port çakışması varsa:
```bash
lsof -i :3001  # 3001 portunu kim kullanıyor
lsof -i :5001  # 5001 portunu kim kullanıyor
kill -9 [PID]  # İlgili process'i sonlandır
```

### MongoDB bağlantı hatası:
```bash
# MongoDB kurulumu (eğer kurulu değilse)
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod
```

## Güncelleme İçin

Kod güncellemesi yapmak istediğinizde:

```bash
cd /var/www/drampa-fashion-ai
git pull origin main
npm install
cd Backend && npm install && cd ..
npm run build
pm2 restart all
```