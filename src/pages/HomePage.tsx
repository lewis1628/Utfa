import React, { useState } from 'react';
import { PageView } from '../types';
import { detectPlatform } from '../utils/storage';
import { 
  Youtube, 
  Instagram, 
  Facebook, 
  Download, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Music, 
  Video, 
  Server, 
  Sparkles, 
  ChevronRight,
  HelpCircle,
  Clock,
  Flame,
  CheckCircle,
  Copy,
  Sliders,
  Play,
  Share2
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageView, initialUrl?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [quickUrl, setQuickUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedSample, setCopiedSample] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const detected = detectPlatform(quickUrl);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = quickUrl.trim();
    if (!target) {
      setErrorMsg('Lütfen geçerli bir video veya müzik bağlantısı girin.');
      return;
    }

    if (detected === 'youtube') {
      onNavigate('youtube', target);
    } else if (detected === 'instagram' || detected === 'tiktok' || detected === 'facebook') {
      onNavigate('social', target);
    } else {
      // Default to YouTube
      onNavigate('youtube', target);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setQuickUrl(text);
          setErrorMsg('');
        }
      }
    } catch {
      // ignore
    }
  };

  const handleSetSample = (sampleUrl: string) => {
    setQuickUrl(sampleUrl);
    setErrorMsg('');
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  const platforms = [
    {
      id: 'youtube',
      name: 'YouTube & Shorts',
      tag: '4K & 320kbps MP3',
      desc: 'YouTube videolarını ve Shorts kliplerini orijinal ses ve 1080p/4K görüntü kalitesiyle ayıklayın.',
      icon: <Youtube className="w-6 h-6 text-rose-500" />,
      accentColor: 'group-hover:border-rose-500/50 group-hover:shadow-rose-500/10',
      badge: 'En Çok Kullanılan',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      specs: ['320 kbps Stüdyo MP3', '60fps 1080p & 4K MP4', 'Shorts Desteği', 'Limitsiz Dönüştürme'],
      action: () => onNavigate('youtube')
    },
    {
      id: 'tiktok',
      name: 'TikTok Video',
      tag: 'Filigransız (No-Watermark)',
      desc: 'TikTok logoları ve kullanıcı adı yazılarını videodan tamamen kaldırarak temiz MP4 indirin.',
      icon: <span className="text-cyan-400 font-display font-black text-xl">TT</span>,
      accentColor: 'group-hover:border-cyan-500/50 group-hover:shadow-cyan-500/10',
      badge: 'Logosuz HD',
      badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      specs: ['Logosuz Orijinal MP4', 'Trend Ses MP3 Çıkarma', 'Süper Hızlı İndirme', 'Mobil Uyumlu'],
      action: () => onNavigate('social')
    },
    {
      id: 'instagram',
      name: 'Instagram Reels',
      tag: 'Reels, Gönderi & Video',
      desc: 'Reels, gönderi videoları ve hikayeleri tek tıkla tam çözünürlükte cihazınıza kaydedin.',
      icon: <Instagram className="w-6 h-6 text-pink-400" />,
      accentColor: 'group-hover:border-pink-500/50 group-hover:shadow-pink-500/10',
      badge: '1080p Reels',
      badgeClass: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      specs: ['1080p Reels Kayıt', 'Carousel Çoklu Seçim', 'Orijinal Ses Dosyası', 'Gizlilik Korumalı'],
      action: () => onNavigate('social')
    },
    {
      id: 'facebook',
      name: 'Facebook Watch',
      tag: 'Watch & Reels',
      desc: 'Facebook akışındaki tüm videoları ve Facebook Reels kliplerini yüksek hızda dönüştürün.',
      icon: <Facebook className="w-6 h-6 text-blue-400" />,
      accentColor: 'group-hover:border-blue-500/50 group-hover:shadow-blue-500/10',
      badge: 'FB Watch HD',
      badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      specs: ['Full HD & SD Seçenekleri', 'FB Watch Desteği', 'MP3 Ses Ayıklama', 'Tek Tıkla İndirme'],
      action: () => onNavigate('social')
    },
  ];

  const faqs = [
    {
      q: 'VidiLoad tamamen ücretsiz mi ve indirme sınırı var mı?',
      a: 'Evet, VidiLoad üzerinde video ve müzik dönüştürme tamamen ücretsizdir. Günlük veya dosya boyutu sınırı olmaksızın istediğiniz kadar video ve ses dosyası indirebilirsiniz.'
    },
    {
      q: 'Hangi ses ve video formatlarını destekliyorsunuz?',
      a: 'Ses tarafında 320 kbps, 256 kbps ve 128 kbps stüdyo kalitesinde MP3; video tarafında ise 1080p Full HD, 720p HD, 480p ve 360p MP4 formatlarını destekliyoruz.'
    },
    {
      q: 'TikTok videolarında filigran (logo) kalkıyor mu?',
      a: 'Evet! TikTok sekmemizde özel filigransız motor devrededir. İndirilen videolarda ekranı kaplayan TikTok logosu ve kullanıcı adı otomatik olarak kaldırılır.'
    },
    {
      q: 'Kendi Ubuntu 22.04 VPS sunucumda nasıl çalıştırabilirim?',
      a: 'Üst menüdeki "Ubuntu 22.04 VPS" sekmesine tıklayarak hazırladığımız tek tıkla otomatik kurulum scriptini indirebilir ve sunucunuzda dakikalar içinde 7/24 kesintisiz çalışan kendi sitenizi kurabilirsiniz.'
    },
  ];

  return (
    <div className="space-y-20 py-4 sm:py-8">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#0d1019] border border-white/[0.08] p-6 sm:p-14 shadow-2xl shadow-black/80">
        
        {/* Subtle decorative background light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-gradient-to-b from-rose-600/15 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold text-rose-300 shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span>VidiLoad Studio 2.0 • Ultra Hızlı Medya Transcoder Motoru</span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.12]">
              Tüm Videoları <span className="bg-gradient-to-r from-rose-500 via-red-500 to-amber-400 bg-clip-text text-transparent">Kusursuz Kalitede</span> Dönüştürün
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
              YouTube, Instagram Reels, TikTok ve Facebook videolarını saniyeler içinde stüdyo kalitesinde <strong>320 kbps MP3</strong> veya <strong>1080p/4K MP4</strong> formatında indirin.
            </p>
          </div>

          {/* OMNIBOX URL INPUT */}
          <div className="max-w-2xl mx-auto space-y-3">
            <form onSubmit={handleQuickSubmit} className="relative group">
              <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-[#121622] rounded-2xl sm:rounded-full border border-white/15 focus-within:border-rose-500 shadow-2xl focus-within:shadow-rose-600/20 transition-all duration-300">
                
                {/* Platform detector indicator */}
                <div className="hidden sm:flex items-center justify-center pl-3 text-slate-400">
                  {detected === 'youtube' && <Youtube className="w-5 h-5 text-rose-500 animate-bounce" />}
                  {detected === 'instagram' && <Instagram className="w-5 h-5 text-pink-500 animate-bounce" />}
                  {detected === 'tiktok' && <span className="font-bold text-cyan-400 text-xs">TT</span>}
                  {detected === 'facebook' && <Facebook className="w-5 h-5 text-blue-500 animate-bounce" />}
                  {!detected && <Download className="w-5 h-5 text-slate-500" />}
                </div>

                <input
                  type="text"
                  value={quickUrl}
                  onChange={(e) => {
                    setQuickUrl(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Video bağlantısını buraya yapıştırın (YouTube, IG, TikTok, FB)..."
                  className="w-full bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm px-3 py-2.5 focus:outline-none"
                  id="home-quick-url-input"
                />

                {/* Paste button inside bar */}
                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold shrink-0 transition-all border border-white/5"
                  title="Panodan Yapıştır"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Yapıştır</span>
                </button>

                {/* Submit button */}
                <button
                  type="submit"
                  id="home-quick-submit-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-display font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/30 shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Dönüştür</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Sample link hint */}
              <div className="flex flex-wrap items-center justify-between text-xs pt-2 px-2 text-slate-400 gap-2">
                <div className="flex items-center gap-2">
                  <span>Hızlı test için:</span>
                  <button
                    type="button"
                    onClick={() => handleSetSample('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
                    className="text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-2 decoration-rose-500/40"
                  >
                    Örnek YouTube Videosu Doldur
                  </button>
                  {copiedSample && <span className="text-emerald-400 font-medium">✓ Dolduruldu</span>}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span>MP3 • MP4 • 1080p • 4K</span>
                </div>
              </div>
            </form>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-left">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-[#121622]/80 border border-white/[0.06] text-center">
              <div className="text-base sm:text-lg font-display font-black text-white">320 kbps</div>
              <div className="text-[11px] text-slate-400 font-medium">Stüdyo Kalite MP3</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#121622]/80 border border-white/[0.06] text-center">
              <div className="text-base sm:text-lg font-display font-black text-rose-400">4K / 1080p</div>
              <div className="text-[11px] text-slate-400 font-medium">Full HD 60fps MP4</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#121622]/80 border border-white/[0.06] text-center">
              <div className="text-base sm:text-lg font-display font-black text-cyan-400">%100 Temiz</div>
              <div className="text-[11px] text-slate-400 font-medium">TikTok Logosuz Mod</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#121622]/80 border border-white/[0.06] text-center">
              <div className="text-base sm:text-lg font-display font-black text-emerald-400">Ubuntu 22.04</div>
              <div className="text-[11px] text-slate-400 font-medium">VPS Hazır Altyapı</div>
            </div>
          </div>

        </div>
      </section>

      {/* PLATFORMS BENTO GRID */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/[0.08] pb-4">
          <div>
            <div className="text-xs font-mono font-bold text-rose-400 tracking-wider uppercase mb-1">
              Desteklenen Medya Ağları
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Her Platform İçin Özel Optimize Motor
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Tüm sosyal medya mecralarındaki video ve ses formatları en güncel algoritmalarla anında taranır.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platforms.map((p) => (
            <div
              key={p.id}
              onClick={p.action}
              className={`group cursor-pointer rounded-3xl bg-[#0f121d] border border-white/[0.08] p-6 sm:p-7 transition-all duration-300 hover:bg-[#131726] hover:scale-[1.01] shadow-lg relative overflow-hidden ${p.accentColor}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#181d2c] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {p.icon}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-rose-400 transition-colors">
                      {p.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">{p.tag}</span>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${p.badgeClass}`}>
                  {p.badge}
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                {p.desc}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] mb-5">
                {p.specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{spec}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-rose-400 pt-1">
                <span>Dönüştürücüyü Aç</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS - 3 STEP WORKFLOW */}
      <section className="rounded-3xl bg-[#0d1019] border border-white/[0.08] p-6 sm:p-10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-rose-400 tracking-wider uppercase">Nasıl Çalışır?</span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">3 Adımda Dosyanız Cebinizde</h2>
          <p className="text-xs text-slate-400">Karmaşık ayarlar olmadan doğrudan indirme bağlantısı alın.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#121624] border border-white/[0.06] space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-display font-black text-lg flex items-center justify-center">
              1
            </div>
            <h3 className="font-display font-bold text-base text-white">Bağlantıyı Kopyalayın</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              YouTube, Instagram, TikTok veya Facebook üzerinden dilediğiniz video veya şarkının linkini kopyalayın.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121624] border border-white/[0.06] space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-display font-black text-lg flex items-center justify-center">
              2
            </div>
            <h3 className="font-display font-bold text-base text-white">Format & Kalite Seçin</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Video için 1080p/720p MP4, sadece müzik içinse stüdyo kalitesinde 320 kbps MP3 seçeneğini belirleyin.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121624] border border-white/[0.06] space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-display font-black text-lg flex items-center justify-center">
              3
            </div>
            <h3 className="font-display font-bold text-base text-white">Anında Cihazınıza İndirin</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sunucumuz FFmpeg ile dosyayı işler ve tarayıcınızın indirme yöneticisine tam hızda aktarır.
            </p>
          </div>
        </div>
      </section>

      {/* UBUNTU 22.04 VPS ACTION BANNER */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-950/60 via-[#0d141e] to-[#090b10] border border-emerald-500/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
              <Server className="w-3.5 h-3.5" />
              <span>Ubuntu 22.04 LTS VPS Entegrasyonu</span>
            </div>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
              Kendi VPS Sunucunuzda 7/24 Kesintisiz Çalıştırın! 🚀
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tek tıkla otomatik kurulum scripti ile Node.js 20, FFmpeg, yt-dlp ve Nginx dakikalar içinde sunucunuzda yapılandırılır.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('vps')}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              VPS Kurulum Rehberini Aç
            </button>
            <a
              href="/api/ubuntu-script"
              download="setup-ubuntu-22.04.sh"
              className="px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-slate-200 font-semibold text-xs border border-white/10 transition-all"
            >
              Scripti İndir (.sh)
            </a>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono font-bold text-rose-400 tracking-wider uppercase">Merak Edilenler</div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">Sıkça Sorulan Sorular</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0f121d] border border-white/[0.08] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-display font-bold text-sm sm:text-base text-white">{faq.q}</span>
                  <span className="text-xs text-slate-400 font-mono font-bold shrink-0">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.04]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
