#!/usr/bin/env bash
# ==============================================================================
# VidiLoad Studio - Otomatik Canlı Kurulum ve Test Scripti
# Desteklenen Sistemler: Ubuntu 20.04+, 22.04+, 24.04+, Debian 11+, VPS, Cloud
# ==============================================================================

set -e

echo ""
echo "=================================================================="
echo "   🚀 VidiLoad Studio - Video & MP3 İndirici Kurulumu Başlıyor"
echo "=================================================================="
echo ""

# 1. Root veya sudo kontrolü
if [ "$EUID" -ne 0 ]; then
  SUDO='sudo'
else
  SUDO=''
fi

# 2. Sistem Paket Güncellemesi & FFmpeg Kurulumu
echo "📦 1/5: FFmpeg, Python3, Curl ve Sistem Bağımlılıkları Yükleniyor..."
$SUDO apt-get update -y
$SUDO apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    ffmpeg \
    python3 \
    git \
    build-essential

# 3. En Güncel yt-dlp İndirme ve İzin Verme
echo "⚡ 2/5: En Güncel yt-dlp Medya Motoru Kuruluyor..."
$SUDO curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
$SUDO chmod a+rx /usr/local/bin/yt-dlp

echo "✅ yt-dlp Sürümü: $(/usr/local/bin/yt-dlp --version)"
echo "✅ FFmpeg Sürümü: $(ffmpeg -version | head -n 1)"

# 4. Node.js Kontrolü (Gerekirse Node.js 20 LTS Kurulumu)
echo "🟢 3/5: Node.js Ortamı Kontrol Ediliyor..."
if ! command -v node &> /dev/null; then
  echo "Node.js bulunamadı, Node.js 20 LTS kuruluyor..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | $SUDO -E bash -
  $SUDO apt-get install -y nodejs
else
  echo "Node.js mevcut: $(node -v)"
fi

# 5. NPM Bağımlılıkları ve Derleme (Build)
echo "📦 4/5: Proje Paketleri Yükleniyor (npm install)..."
npm install

echo "🛠️ 5/5: Üretim Derlemesi Yapılıyor (npm run build)..."
npm run build

echo ""
echo "=================================================================="
echo "   🎉 KURULUM BAŞARIYLA TAMAMLANDI!"
echo "=================================================================="
echo ""
echo "Projeyi hemen test etmek için:"
echo "  npm start"
echo ""
echo "Sunucuda 7/24 kesintisiz (PM2 ile) çalıştırmak için:"
echo "  $SUDO npm install -g pm2"
echo "  pm2 start dist/server.cjs --name vidiload"
echo "  pm2 save"
echo "  pm2 startup"
echo ""
echo "Canlı Test Endpointleri:"
echo "  Sağlık Kontrolü: http://localhost:3000/api/health"
echo "  Sistem Teşhisi:  http://localhost:3000/api/test-diagnostic"
echo "=================================================================="
echo ""
