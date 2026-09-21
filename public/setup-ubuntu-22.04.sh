#!/bin/bash
# ==============================================================================
# VidiLoad - Ubuntu 22.04 LTS Full-Stack Otomatik Kurulum ve Yapılandırma Scripti
# ==============================================================================
# Bu script Ubuntu 22.04 sunucunuzda:
# 1. Gerekli tüm sistem paketlerini (curl, git, ffmpeg, build-essential, nginx) kurar.
# 2. Node.js 20 LTS sürümünü kurar.
# 3. yt-dlp'nin en güncel sürümünü /usr/local/bin altına yükler.
# 4. PM2 process manager'ı kurar ve otomatik başlatmayı ayarlar.
# 5. Nginx ters vekil sunucusunu 3000 portuna yönlendirecek şekilde yapılandırır.
# ==============================================================================

set -e

echo "🚀 [1/6] Ubuntu 22.04 paket listeleri güncelleniyor..."
sudo apt update && sudo apt upgrade -y

echo "📦 [2/6] FFmpeg, Git, Curl, Nginx ve temel derleme paketleri yükleniyor..."
sudo apt install -y curl git ffmpeg build-essential nginx python3-pip

echo "⚡ [3/6] Node.js 20 LTS kuruluyor..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "🎥 [4/6] En güncel yt-dlp medya motoru kuruluyor..."
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

echo "🛠️ [5/6] PM2 servis yöneticisi global yükleniyor..."
sudo npm install -g pm2

echo "🌐 [6/6] Nginx Reverse Proxy (Ters Vekil) ayarlanıyor..."
cat << 'EOF' | sudo tee /etc/nginx/sites-available/vidiload
server {
    listen 80;
    server_name _;

    client_max_body_size 250M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/vidiload /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo ""
echo "=============================================================================="
echo "🎉 TEBRİKLER! Ubuntu 22.04 Sunucu Altyapınız Başarıyla Hazırlandı!"
echo "=============================================================================="
echo "Şimdi projenizin bulunduğu dizinde şu 3 adımı çalıştırarak sitenizi yayına alın:"
echo ""
echo "  1) npm install"
echo "  2) npm run build"
echo "  3) pm2 start dist/server.cjs --name vidiload"
echo "  4) pm2 save && pm2 startup"
echo ""
echo "Domain bağlayıp ücretsiz SSL almak için:"
echo "  sudo apt install -y certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d siteadiniz.com -d www.siteadiniz.com"
echo "=============================================================================="
