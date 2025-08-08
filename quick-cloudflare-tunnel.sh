#\!/bin/bash

echo "🌐 Hızlı Cloudflare Tunnel Kurulumu"
echo "===================================="
echo ""
echo "Bu yöntemle 5 dakikada güvenli HTTPS bağlantınız olacak\!"
echo ""

# Server script
cat << 'REMOTE' > server-cloudflare.sh
#\!/bin/bash

echo "📦 Cloudflared kurulumu..."

# Cloudflared'i kur
if \! command -v cloudflared &> /dev/null; then
    curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
    dpkg -i cloudflared.deb
fi

echo ""
echo "🔐 Cloudflare'e giriş yapın..."
cloudflared tunnel login

echo ""
echo "🚇 Tunnel oluşturuluyor..."
cloudflared tunnel create drampa-backend

echo ""
echo "📝 Tunnel ID'sini not alın ve config oluşturun..."
TUNNEL_ID=$(cloudflared tunnel list | grep drampa-backend | awk '{print $1}')

cat > ~/.cloudflared/config.yml << CONFIG
tunnel: $TUNNEL_ID
credentials-file: /root/.cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: api-drampa.tryagain.app
    service: http://localhost:5001
  - service: http_status:404
CONFIG

echo ""
echo "🌐 DNS kaydı oluşturuluyor..."
cloudflared tunnel route dns drampa-backend api-drampa.tryagain.app

echo ""
echo "🚀 Tunnel başlatılıyor..."
cloudflared tunnel run drampa-backend &

echo ""
echo "⚙️  Servis olarak kurulum..."
cloudflared service install
systemctl start cloudflared
systemctl enable cloudflared

echo ""
echo "✅ Kurulum tamamlandı\!"
echo ""
echo "🎉 Yeni backend URL'niz:"
echo "   https://api-drampa.tryagain.app"
echo ""
echo "Vercel'de güncelleyin:"
echo "NEXT_PUBLIC_BACKEND_URL = https://api-drampa.tryagain.app"
REMOTE

echo "📤 Script'i server'a gönderiyorum..."
scp -i ~/.ssh/id_ed25519_contabo server-cloudflare.sh root@31.220.81.177:/root/

echo ""
echo "🚀 Kurulum başlatılıyor..."
echo "NOT: Cloudflare hesabınıza giriş yapmanız istenecek"
echo ""
ssh -i ~/.ssh/id_ed25519_contabo root@31.220.81.177 "bash /root/server-cloudflare.sh"
