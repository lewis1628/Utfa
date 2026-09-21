import React, { useState } from 'react';
import { 
  Server, 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  ExternalLink, 
  Cpu, 
  Globe, 
  HardDrive, 
  AlertTriangle,
  PlayCircle,
  Sparkles,
  Zap,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const VpsGuidePage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: '1. Adım: VPS Sunucunuza SSH ile Bağlanın',
      desc: 'Hetzner, DigitalOcean, Vultr veya Contabo üzerinden aldığınız Ubuntu 22.04 LTS sunucunuzun terminaline bağlanın:',
      command: 'ssh root@SUNUCU_IP_ADRESINIZ',
    },
    {
      title: '2. Adım: Tek Tıkla Otomatik Kurulum Scripti (Önerilen)',
      desc: 'Aşağıdaki komutu sunucunuzun terminaline yapıştırdığınızda Node.js 20, FFmpeg, yt-dlp, Nginx ve PM2 sırayla otomatik kurulur ve yapılandırılır:',
      command: 'curl -fsSL https://raw.githubusercontent.com/vidiload/setup/main/setup-ubuntu-22.04.sh | bash',
      subtext: 'Veya aşağıdaki adımları tek tek manuel olarak çalıştırabilirsiniz.'
    },
    {
      title: '3. Adım: Ubuntu Paket Güncellemesi & FFmpeg Kurulumu',
      desc: 'Sistem depolarını güncelleyin ve video/ses dönüştürücünün kalbi olan FFmpeg paketini yükleyin:',
      command: `sudo apt update && sudo apt upgrade -y\nsudo apt install -y curl git ffmpeg build-essential nginx python3-pip`,
    },
    {
      title: '4. Adım: Node.js 20 LTS Kurulumu',
      desc: 'Express ve Vite altyapımızı sorunsuz çalıştırmak için Node.js 20 LTS kurun:',
      command: `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt install -y nodejs\nnode -v && npm -v`,
    },
    {
      title: '5. Adım: En Güncel yt-dlp Medya Motorunun Kurulması',
      desc: 'YouTube, Instagram ve TikTok güncellemelerinden etkilenmemek için yt-dlp binary dosyasını kurup çalıştırma izni verin:',
      command: `sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp\nsudo chmod a+rx /usr/local/bin/yt-dlp\nyt-dlp --version`,
    },
    {
      title: '6. Adım: Projeyi Sunucuya Çekme ve Derleme (Build)',
      desc: 'Projenin dizinine girip paketleri yükleyin ve üretim derlemesini (dist/server.cjs) oluşturun:',
      command: `cd /var/www\ngit clone <SIZIN_GITHUB_DEPO_LINKINIZ> vidiload\ncd vidiload\nnpm install\nnpm run build`,
    },
    {
      title: '7. Adım: PM2 ile 7/24 Kesintisiz Arka Planda Başlatma',
      desc: 'Sunucu yeniden başlasa bile sitenizin hiç durmadan çalışması için PM2 servis yöneticisini başlatın:',
      command: `sudo npm install -g pm2\npm2 start dist/server.cjs --name vidiload\npm2 startup\npm2 save`,
    },
    {
      title: '8. Adım: Nginx Ters Vekil (Port 3000 -> 80 Domain Yönlendirmesi)',
      desc: 'Sitenize IP adresi veya domain ile girdiğinizde 3000 portundaki Node uygulamasını karşılaması için Nginx dosyasını kaydedin:',
      command: `cat << 'EOF' | sudo tee /etc/nginx/sites-available/vidiload
server {
    listen 80;
    server_name _; # Buraya alan adınızı (ornek.com) yazabilirsiniz

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
sudo nginx -t && sudo systemctl restart nginx`,
    },
    {
      title: '9. Adım: Ücretsiz SSL (HTTPS Yeşil Kilit) Kurulumu',
      desc: 'Domaininizi sunucuya yönlendirdikten sonra Let\'s Encrypt ile tek tıkla SSL sertifikası alın:',
      command: `sudo apt install -y certbot python3-certbot-nginx\nsudo certbot --nginx -d siteadiniz.com -d www.siteadiniz.com`,
    },
  ];

  return (
    <div className="space-y-10 py-4 sm:py-6 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="rounded-[2.5rem] bg-gradient-to-r from-emerald-950/80 via-[#0d141e] to-[#090b10] border border-emerald-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
            <Server className="w-3.5 h-3.5" />
            <span>Ubuntu 22.04 LTS Canlı Dağıtım Rehberi</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Birlikte VPS'te Sitemizi Ayağa Kaldıralım! 🚀
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Kanka, aldığın Ubuntu 22.04 VPS sunucusu üzerinde bu adımları takip ettiğinde YouTube, Instagram, TikTok ve Facebook dönüştürücümüz <strong>7/24 kesintisiz, sıfır çökme</strong> ve süper hızlı bir şekilde yayında olacak.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="/setup-ubuntu-22.04.sh"
              download="setup-ubuntu-22.04.sh"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>setup-ubuntu-22.04.sh Dosyasını İndir</span>
            </a>
            <span className="text-xs text-slate-400 font-mono">Tek komutla çalıştırılabilir bash scripti</span>
          </div>
        </div>
      </div>

      {/* System Architecture Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f121d] border border-white/[0.08] space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono">
            <Cpu className="w-4 h-4" />
            <span>Önerilen VPS Donanımı</span>
          </div>
          <p className="text-sm text-white font-bold">1-2 vCPU, 2 GB RAM, 20 GB NVMe</p>
          <p className="text-xs text-slate-400">Hetzner CX22, DigitalOcean Basic veya Contabo yeterlidir.</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f121d] border border-white/[0.08] space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono">
            <Terminal className="w-4 h-4" />
            <span>İşletim Sistemi</span>
          </div>
          <p className="text-sm text-white font-bold">Ubuntu 22.04 LTS (Jammy)</p>
          <p className="text-xs text-slate-400">FFmpeg 4.4+ ve Node.js 20 ile %100 uyumlu test edildi.</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f121d] border border-white/[0.08] space-y-2">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Süreklilik & Güvenlik</span>
          </div>
          <p className="text-sm text-white font-bold">PM2 & Nginx SSL Proxy</p>
          <p className="text-xs text-slate-400">Otomatik yeniden başlatma ve Let's Encrypt SSL koruması.</p>
        </div>
      </div>

      {/* Command Steps - Terminal Mockup Design */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white flex items-center gap-2">
            <span>Adım Adım Kurulum Komutları</span>
          </h2>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            9 Adımlı Kurulum Matrisi
          </span>
        </div>

        {steps.map((step, idx) => (
          <div key={idx} className="rounded-2xl bg-[#0d1019] border border-white/[0.08] overflow-hidden shadow-md">
            {/* Terminal Top Bar */}
            <div className="p-4 bg-[#111420] border-b border-white/[0.06] flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-display font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400">{step.desc}</p>
              </div>

              {/* Window dots */}
              <div className="hidden sm:flex items-center gap-1.5 opacity-60">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
            </div>

            {/* Terminal Code Window */}
            <div className="p-4 bg-[#090b10] font-mono text-xs text-emerald-400 relative group">
              <pre className="overflow-x-auto whitespace-pre-wrap pr-20 leading-relaxed">
                {step.command}
              </pre>

              <button
                type="button"
                onClick={() => copyToClipboard(step.command, idx)}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 text-xs font-medium border border-white/10 transition-all shadow"
                title="Komutu Kopyala"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                    <span className="text-emerald-400 font-bold">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopyala</span>
                  </>
                )}
              </button>
            </div>

            {step.subtext && (
              <div className="px-4 py-2 bg-[#0d1019] text-[11px] text-slate-500 border-t border-white/[0.04]">
                {step.subtext}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pro Tips & YouTube Rate Limit Mitigation */}
      <div className="rounded-3xl bg-[#0f121d] border border-amber-500/30 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-display font-bold text-base">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Önemli VPS İpuçları & YouTube Bloklarını Engelleme</span>
        </div>

        <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="text-amber-400 font-bold">•</span>
            <span>
              <strong>yt-dlp Düzenli Güncelleme:</strong> YouTube algoritma güncellediğinde tek komutla motoru güncel tutun: <code className="px-1.5 py-0.5 rounded bg-black/60 text-emerald-400 font-mono">yt-dlp -U</code>.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-amber-400 font-bold">•</span>
            <span>
              <strong>Cookies (Çerez) Entegrasyonu:</strong> YouTube veri merkezi IP'lerinde bazen robot doğrulaması isteyebilir. Tarayıcınızdan aldığınız çerez dosyasını sunucuya <code className="px-1.5 py-0.5 rounded bg-black/60 text-emerald-400 font-mono">cookies.txt</code> olarak yükleyip yt-dlp çağrısına <code className="px-1.5 py-0.5 rounded bg-black/60 text-emerald-400 font-mono">--cookies cookies.txt</code> ekleyebilirsiniz.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-amber-400 font-bold">•</span>
            <span>
              <strong>UFW Güvenlik Duvarı:</strong> Sunucunuzda portları açmak için: <code className="px-1.5 py-0.5 rounded bg-black/60 text-emerald-400 font-mono">sudo ufw allow 'Nginx Full' && sudo ufw allow OpenSSH && sudo ufw enable</code>.
            </span>
          </li>
        </ul>
      </div>

    </div>
  );
};
