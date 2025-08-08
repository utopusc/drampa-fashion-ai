#!/bin/bash

echo "🌐 Setting up Cloudflare Tunnel for Backend"
echo "==========================================="
echo ""
echo "This will create a secure HTTPS tunnel to your backend"
echo "No SSL certificate needed!"
echo ""

# Instructions for server
cat << 'EOF' > cloudflare-server-setup.sh
#!/bin/bash

# Install cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Create tunnel
cloudflared tunnel create drampa-backend

# Configure tunnel
cat > ~/.cloudflared/config.yml << CONFIG
tunnel: drampa-backend
credentials-file: /root/.cloudflared/[TUNNEL_ID].json

ingress:
  - hostname: api-drampa.utopusc.workers.dev
    service: http://localhost:5001
  - service: http_status:404
CONFIG

# Run tunnel
cloudflared tunnel run drampa-backend

# To make it permanent:
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
EOF

echo "📋 Manual Steps Required:"
echo ""
echo "1. Go to Cloudflare Dashboard: https://dash.cloudflare.com"
echo "2. Select your domain (if you have one) or use Cloudflare Tunnel"
echo "3. Go to Zero Trust → Access → Tunnels"
echo "4. Create a new tunnel named 'drampa-backend'"
echo "5. Install connector on your server (31.220.81.177)"
echo "6. Configure public hostname:"
echo "   - Subdomain: api"
echo "   - Domain: Select your domain or use cloudflare tunnel domain"
echo "   - Service: HTTP://localhost:5001"
echo ""
echo "7. Once done, you'll get a URL like:"
echo "   https://api.your-domain.com"
echo "   or"
echo "   https://drampa-backend.your-tunnel-id.cloudflare.com"
echo ""
echo "8. Update Vercel environment variable:"
echo "   NEXT_PUBLIC_BACKEND_URL = [your-cloudflare-tunnel-url]"
echo ""
echo "✅ Benefits:"
echo "- Real HTTPS certificate (no warnings)"
echo "- DDoS protection"
echo "- No port exposure needed"
echo "- Free tier available"
echo ""
echo "🔗 Documentation: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/"