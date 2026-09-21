# 🚀 VidiLoad Studio - Profesyonel Video & MP3 İndirici (GitHub Deployment)

VidiLoad Studio; YouTube (4K/1080p/Shorts), Instagram (Reels), TikTok (Filigransız) ve Facebook videolarını stüdyo kalitesinde **MP4** ve **320 kbps MP3** formatına dönüştürüp indiren tam kapsamlı, modern bir web uygulamasıdır.

---

## ⚡ Hızlı Başlangıç (1 Dakikada Test Etme)

Projeyi GitHub'dan klonlayıp hemen yerelinizde veya sunucunuzda test etmek için:

```bash
# 1. Depoyu klonlayın
git clone <GITHUB_REPO_URL>
cd vidiload-studio

# 2. Paketleri yükleyin
npm install

# 3. Geliştirici modunda başlatın
npm run dev
```

Tarayıcınızda açın: **http://localhost:3000**

---

## 🐳 Docker ile Tek Komutla Canlıya Alma (Önerilen)

Sisteminizde `ffmpeg` veya `yt-dlp` yüklü olmasa bile Docker tüm bağımlılıkları izole şekilde otomatik olarak kurar:

```bash
docker compose up -d --build
```

Container ayağa kalktığında otomatik olarak `http://localhost:3000` portunda çalışacaktır.

---

## 🖥️ Ubuntu / Debian VPS Tek Komutla Kurulum

Hetzner, DigitalOcean, Contabo veya AWS VPS sunucunuzda çalıştırmak için hazırlanan otomatik kurulum betiğini çalıştırabilirsiniz:

```bash
chmod +x ./setup.sh
./setup.sh
```

Bu script sırasıyla:
1. `ffmpeg`, `python3`, `curl` ve sistem paketlerini günceller.
2. En güncel `yt-dlp` motorunu `/usr/local/bin/yt-dlp` dizinine kurar.
3. Node.js 20+ kontrolü yapar.
4. `npm install` ve `npm run build` komutlarını çalıştırarak projeyi üretime hazır hale getirir.

### PM2 ile 7/24 Kesintisiz Arka Planda Çalıştırma
```bash
sudo npm install -g pm2
pm2 start dist/server.cjs --name vidiload
pm2 save
pm2 startup
```

---

## 🔍 Canlı Test ve Teşhis Endpointleri

Sitenin sağlıklı çalışıp çalışmadığını ve medya motorunun aktifliğini anında test etmek için aşağıdaki API rotalarını kullanabilirsiniz:

- **Sağlık Durumu:** `GET /api/health`
  ```json
  {
    "status": "ok",
    "hasYtDlp": true,
    "hasFfmpeg": true,
    "ytDlpVersion": "2026.08.19",
    "ffmpegVersion": "4.4.2"
  }
  ```

- **Detaylı Sistem Teşhisi:** `GET /api/test-diagnostic`
  - Bellek kullanımı, işlemci mimarisi, araç yolları ve test endpointlerini döner.

- **Video Bilgi Analizi Testi:** `POST /api/video-info`
  ```bash
  curl -X POST http://localhost:3000/api/video-info \
       -H "Content-Type: application/json" \
       -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
  ```

---

## 🛠️ Proje Komutları

| Komut | Açıklama |
| :--- | :--- |
| `npm run dev` | Geliştirme sunucusunu başlatır (`tsx server.ts`) |
| `npm run build` | Frontend Vite ve backend CJS bundle derlemesi yapar |
| `npm start` | Derlenmiş üretim sunucusunu başlatır (`node dist/server.cjs`) |
| `npm run setup` | Sistem bağımlılıklarını kurar (`bash ./setup.sh`) |
| `npm run lint` | TypeScript tip denetimini çalıştırır (`tsc --noEmit`) |

---

## 🌟 Desteklenen Platformlar
- **YouTube:** 4K, 1440p, 1080p, 720p MP4 ve 320 kbps MP3 ses çıkarma.
- **YouTube Shorts:** Dikey formatta kayıpsız indirme.
- **TikTok:** Filigransız (Watermark'sız) temiz video akışı.
- **Instagram:** Reels, IGTV ve gönderi videoları.
- **Facebook:** Watch ve herkese açık videolar.

---

**Lisans:** MIT
