# Cloudflare SSL ve DNS Yapılandırma Rehberi

## 🌐 Cloudflare Hesap Kurulumu

### Adım 1: Cloudflare Hesabı Oluşturma
1. [Cloudflare.com](https://www.cloudflare.com) adresine gidin
2. "Sign Up" butonuna tıklayarak ücretsiz hesap oluşturun
3. E-posta adresinizi doğrulayın

### Adım 2: Domain Ekleme
1. Cloudflare Dashboard'a giriş yapın
2. "Add a Site" butonuna tıklayın
3. Domain adresinizi girin (örn: `drampa.ai`)
4. Free plan'ı seçin (SSL için yeterli)
5. "Continue" butonuna tıklayın

## 🔧 DNS Yapılandırması

### Adım 3: DNS Kayıtlarını Yapılandırma

Cloudflare size mevcut DNS kayıtlarınızı gösterecek. Aşağıdaki kayıtları ekleyin/güncelleyin:

```
Type    Name        Content             Proxy Status    TTL
A       @           31.220.81.177       Proxied         Auto
A       www         31.220.81.177       Proxied         Auto
CNAME   api         @                   Proxied         Auto
```

**Önemli:** "Proxied" (turuncu bulut) seçeneğinin aktif olduğundan emin olun. Bu, Cloudflare'in SSL sertifikası sağlamasını ve DDoS koruması sunmasını sağlar.

### Adım 4: Nameserver'ları Güncelleme

1. Cloudflare size 2 nameserver adresi verecek (örn: `alex.ns.cloudflare.com` ve `bella.ns.cloudflare.com`)
2. Domain kayıt firmanızın (registrar) kontrol paneline gidin
3. Domain'in nameserver ayarlarını bulun
4. Mevcut nameserver'ları Cloudflare'in verdiği nameserver'larla değiştirin
5. Değişiklikler 24 saate kadar sürebilir (genelde 5-10 dakika)

## 🔒 SSL/TLS Yapılandırması

### Adım 5: SSL/TLS Ayarları

1. Cloudflare Dashboard'da domain'inizi seçin
2. Sol menüden **SSL/TLS** sekmesine gidin
3. **Overview** sayfasında encryption mode'u seçin:
   - **Flexible** (Başlangıç için - Sunucuda SSL yok)
   - **Full** (Sunucuda self-signed SSL var)
   - **Full (strict)** (Sunucuda geçerli SSL var - Önerilen)

### Adım 6: Edge Certificates

1. **SSL/TLS > Edge Certificates** sayfasına gidin
2. **Always Use HTTPS** seçeneğini aktif edin
3. **Automatic HTTPS Rewrites** seçeneğini aktif edin
4. **Minimum TLS Version** olarak TLS 1.2 seçin

### Adım 7: Origin Server Certificate (Opsiyonel ama Önerilen)

Cloudflare ile sunucu arasında şifreli bağlantı için:

1. **SSL/TLS > Origin Server** sayfasına gidin
2. **Create Certificate** butonuna tıklayın
3. Private key type olarak RSA seçin
4. Certificate validity: 15 years seçin
5. **Create** butonuna tıklayın
6. Gösterilen sertifika ve private key'i kopyalayın

Sunucuda bu sertifikaları kaydedin:
```bash
# Sunucuya SSH ile bağlanın
ssh root@31.220.81.177

# Sertifika dizinlerini oluşturun
mkdir -p /etc/ssl/cloudflare

# Sertifikaları oluşturun
nano /etc/ssl/cloudflare/cert.pem
# (Cloudflare'den kopyaladığınız Origin Certificate'ı yapıştırın)

nano /etc/ssl/cloudflare/key.pem
# (Cloudflare'den kopyaladığınız Private Key'i yapıştırın)

# Dosya izinlerini ayarlayın
chmod 644 /etc/ssl/cloudflare/cert.pem
chmod 600 /etc/ssl/cloudflare/key.pem
```

## 📝 Nginx Yapılandırması Güncelleme

Sunucuda Nginx yapılandırmasını güncelleyin:

```bash
nano /etc/nginx/sites-available/drampa-fashion-ai
```

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name drampa.ai www.drampa.ai api.drampa.ai;
    return 301 https://$server_name$request_uri;
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name drampa.ai www.drampa.ai;

    # Cloudflare Origin Certificate
    ssl_certificate /etc/ssl/cloudflare/cert.pem;
    ssl_certificate_key /etc/ssl/cloudflare/key.pem;
    
    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

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
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;
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
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;
    }

    # Static files
    location /_next/static {
        proxy_pass http://localhost:3001;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, immutable";
    }

    # Upload files
    location /uploads {
        alias /var/www/drampa-fashion-ai/Backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 50M;
}

# API subdomain
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.drampa.ai;

    ssl_certificate /etc/ssl/cloudflare/cert.pem;
    ssl_certificate_key /etc/ssl/cloudflare/key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
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
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;
    }
}
```

Nginx'i yeniden başlatın:
```bash
nginx -t
systemctl restart nginx
```

## 🚀 Environment Variables Güncelleme

Frontend `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BACKEND_URL=https://api.drampa.ai
FAL_KEY=your_fal_api_key
```

Backend `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/drampa-fashion
JWT_SECRET=your_jwt_secret
PORT=5001
FAL_API_KEY=your_fal_api_key
FRONTEND_URL=https://drampa.ai
```

## ⚡ Cloudflare Optimizasyonları

### Speed Sekmesi
1. **Auto Minify**: JavaScript, CSS, HTML için aktif edin
2. **Brotli**: Aktif edin
3. **Rocket Loader**: Aktif edin (JavaScript optimizasyonu)
4. **Early Hints**: Aktif edin

### Caching Sekmesi
1. **Caching Level**: Standard
2. **Browser Cache TTL**: 4 hours
3. **Always Online**: Aktif edin

### Page Rules (Ücretsiz planda 3 adet)
1. `*drampa.ai/api/*` - Cache Level: Bypass
2. `*drampa.ai/_next/static/*` - Cache Level: Cache Everything, Edge Cache TTL: 1 month
3. `*drampa.ai/uploads/*` - Cache Level: Cache Everything, Edge Cache TTL: 1 month

## 🔍 DNS Propagation Kontrolü

DNS değişikliklerinin yayılıp yayılmadığını kontrol etmek için:
1. [whatsmydns.net](https://www.whatsmydns.net) adresine gidin
2. Domain adresinizi girin
3. Dünyanın farklı noktalarından DNS kayıtlarınızı kontrol edin

## ✅ Test Etme

1. Tarayıcınızda `https://drampa.ai` adresine gidin
2. SSL sertifikasının geçerli olduğunu kontrol edin (kilit simgesi)
3. Console'da herhangi bir mixed content hatası olmadığından emin olun
4. API çağrılarının çalıştığını test edin

## 🛠️ Sorun Giderme

### Problem: SSL Sertifikası Görünmüyor
- Cloudflare'de SSL mode'un en az "Flexible" olduğundan emin olun
- DNS kayıtlarında proxy'nin aktif olduğunu kontrol edin (turuncu bulut)
- 5-10 dakika bekleyin, Cloudflare sertifikayı otomatik oluşturur

### Problem: 521 Web Server Is Down Hatası
- Sunucunuzun çalıştığından emin olun
- Nginx'in çalıştığını kontrol edin: `systemctl status nginx`
- Firewall'da 80 ve 443 portlarının açık olduğunu kontrol edin

### Problem: Mixed Content Hatası
- Tüm URL'lerin HTTPS kullandığından emin olun
- Environment variable'larda HTTPS URL'leri kullanın
- Nginx proxy header'larında `X-Forwarded-Proto https` olduğundan emin olun

## 📞 Destek

Sorun yaşarsanız:
1. Cloudflare Community: community.cloudflare.com
2. Cloudflare Status: cloudflarestatus.com
3. DNS Propagation: whatsmydns.net

---

**Not**: Bu rehber ücretsiz Cloudflare planı için hazırlanmıştır. Pro veya Business planlarında daha fazla özellik ve optimizasyon seçeneği mevcuttur.