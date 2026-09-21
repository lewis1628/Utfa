import React from 'react';
import { PageView } from '../types';
import { Download, Youtube, Instagram, Facebook, ShieldCheck, Terminal, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#07090e] border-t border-white/[0.08] text-slate-400 text-xs py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-md shadow-rose-600/30">
                <Download className="w-4 h-4 text-white stroke-[2.5]" />
              </div>
              <span className="font-display font-black text-lg text-white">
                Vidi<span className="text-rose-500">Load</span> Studio
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              En sevdiğiniz videoları ve müzikleri YouTube, Instagram, TikTok ve Facebook üzerinden stüdyo kalitesinde (1080p, 4K, 320 kbps MP3) dönüştürüp indirin.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Ubuntu 22.04 LTS VPS Motoru Aktif</span>
            </div>
          </div>

          {/* Col 2: Hızlı Araçlar */}
          <div>
            <h4 className="text-slate-200 font-display font-bold mb-3.5 uppercase tracking-wider text-[11px] text-white">
              Dönüştürme Araçları
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('youtube')} className="hover:text-white transition-colors flex items-center gap-2">
                  <Youtube className="w-3.5 h-3.5 text-rose-500" />
                  <span>YouTube 4K & MP3 İndirici</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('social')} className="hover:text-white transition-colors flex items-center gap-2">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram 1080p Reels İndir</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('social')} className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="font-bold text-cyan-400 font-mono text-xs">TT</span>
                  <span>TikTok Filigransız Video İndir</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('social')} className="hover:text-white transition-colors flex items-center gap-2">
                  <Facebook className="w-3.5 h-3.5 text-blue-400" />
                  <span>Facebook HD Video İndirici</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: VPS & Geliştirici */}
          <div>
            <h4 className="text-slate-200 font-display font-bold mb-3.5 uppercase tracking-wider text-[11px] text-white">
              VPS & Altyapı
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => onNavigate('vps')} className="hover:text-emerald-300 transition-colors flex items-center gap-2 text-emerald-400 font-medium">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Ubuntu 22.04 Kurulum Rehberi</span>
                </button>
              </li>
              <li>
                <span className="text-slate-500 font-mono text-[11px]">FFmpeg 6.0 Transcoder</span>
              </li>
              <li>
                <span className="text-slate-500 font-mono text-[11px]">yt-dlp En Güncel Sürüm</span>
              </li>
              <li>
                <span className="text-slate-500 font-mono text-[11px]">PM2 7/24 Daemon & Nginx</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Güvenlik */}
          <div>
            <h4 className="text-slate-200 font-display font-bold mb-3.5 uppercase tracking-wider text-[11px] text-white">
              Güvenlik & Lisans
            </h4>
            <div className="space-y-2.5 text-slate-400 leading-relaxed">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  VidiLoad kişisel kullanım ve offline medya erişimi için geliştirilmiştir. Telif haklarına saygı gösterilmelidir.
                </p>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Sıfır günlük kaydı, %100 gizlilik koruması.
              </p>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} VidiLoad Studio. Birlikte hazırladığımız Ubuntu 22.04 VPS altyapısıyla çalışmaya hazırdır.
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Anasayfa</button>
            <span>•</span>
            <button onClick={() => onNavigate('youtube')} className="hover:text-white transition-colors">YouTube</button>
            <span>•</span>
            <button onClick={() => onNavigate('social')} className="hover:text-white transition-colors">Sosyal Medya</button>
            <span>•</span>
            <button onClick={() => onNavigate('vps')} className="hover:text-emerald-400 transition-colors">VPS Rehberi</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
