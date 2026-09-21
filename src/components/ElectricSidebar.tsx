import React, { useState } from 'react';
import { PageView, User } from '../types';
import { 
  Home, 
  Youtube, 
  Layers, 
  History, 
  Terminal, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Zap, 
  X, 
  Sparkles, 
  Server, 
  Volume2, 
  VolumeX,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface ElectricSidebarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  currentUser: User | null;
  onLogout: () => void;
  historyCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ElectricSidebar: React.FC<ElectricSidebarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
  historyCount,
  isOpen,
  onClose,
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [electricSurge, setElectricSurge] = useState<boolean>(false);

  // High-tech electric sound trigger using Web Audio API
  const playElectricSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.04);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Audio might require user interaction first
    }
  };

  const handleNavClick = (page: PageView) => {
    playElectricSound();
    setElectricSurge(true);
    setTimeout(() => setElectricSurge(false), 500);
    onNavigate(page);
    onClose();
  };

  const navItems = [
    {
      id: 'home' as PageView,
      label: 'Anasayfa',
      sublabel: 'Tüm Platformlar & Hızlı İndir',
      icon: Home,
      badge: null,
      color: 'text-cyan-400',
    },
    {
      id: 'youtube' as PageView,
      label: 'YouTube & Shorts',
      sublabel: '1080p/4K Video & 320k MP3',
      icon: Youtube,
      badge: '4K MP3',
      color: 'text-rose-500',
    },
    {
      id: 'social' as PageView,
      label: 'Sosyal Medya',
      sublabel: 'TikTok No-WM, Instagram, FB',
      icon: Layers,
      badge: 'Filigransız',
      color: 'text-purple-400',
    },
    {
      id: 'history' as PageView,
      label: 'İndirme Geçmişi',
      sublabel: 'Kişisel Medya Arşiviniz',
      icon: History,
      badge: historyCount > 0 ? `${historyCount} Dosya` : null,
      color: 'text-amber-400',
    },
    {
      id: 'vps' as PageView,
      label: 'Ubuntu 22.04 VPS',
      sublabel: 'Tek Satır Kurulum & Nginx',
      icon: Terminal,
      badge: 'Rehber',
      color: 'text-emerald-400',
    },
  ];

  return (
    <>
      {/* Dark Blur Backdrop when opened */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/75 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-over Right Drawer */}
      <aside
        id="electric-right-sidebar"
        className={`fixed top-0 right-0 h-screen z-50 w-[85vw] max-w-sm sm:w-80 bg-[#090d18]/95 backdrop-blur-2xl border-l border-cyan-500/20 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Background Ambient Electric Glow */}
        <div 
          className={`absolute -top-20 -right-20 w-60 h-60 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none transition-opacity duration-300 ${
            electricSurge ? 'opacity-100' : 'opacity-40'
          }`} 
        />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-rose-500 p-0.5 shadow-[0_0_14px_rgba(0,240,255,0.4)]">
              <div className="w-full h-full bg-[#080b13] rounded-[10px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-400 stroke-[2.5] animate-spark-flash" />
              </div>
            </div>
            <div>
              <div className="font-display font-black text-sm text-white flex items-center gap-1.5">
                <span>VidiLoad</span>
                <span className="text-cyan-400">Studio</span>
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">⚡ Electric Navigation</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-white/[0.06] transition-colors"
              title={soundEnabled ? 'Elektrik Sesini Kapat' : 'Elektrik Sesini Aç'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              id="close-sidebar-btn"
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white border border-white/10 transition-colors"
              title="Menüyü Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2 py-4 relative z-10">
          <div className="px-2 pb-2 text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400/80 flex items-center justify-between">
            <span>Dönüştürme Sayfaları</span>
            <span className="text-slate-500 text-[9px]">v2.0 Pro</span>
          </div>

          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                id={`sidebar-item-${item.id}`}
                className={`w-full group flex items-center justify-between p-3 rounded-2xl transition-all duration-200 text-left relative overflow-hidden ${
                  isActive
                    ? 'electric-border-active shadow-[0_0_24px_rgba(0,240,255,0.25)] text-white'
                    : 'electric-hover-item text-slate-300 hover:text-white border border-white/[0.05]'
                }`}
              >
                {/* Active Indicator Bar on Right */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-l-full bg-cyan-400 shadow-[0_0_12px_#00f0ff] animate-pulse" />
                )}

                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isActive
                        ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(0,240,255,0.5)]'
                        : 'bg-[#111624] text-slate-300 group-hover:bg-[#161c2e] group-hover:text-cyan-300 border border-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>

                  <div className="min-w-0">
                    <div className={`font-display text-xs font-bold truncate ${isActive ? 'text-white' : 'group-hover:text-cyan-300'}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border shrink-0 ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-white/[0.04] text-slate-400 border-white/5 group-hover:border-cyan-500/20'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Account / User Section */}
          <div className="pt-4 border-t border-white/[0.08] space-y-2">
            <div className="px-2 text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
              Kullanıcı Hesabı
            </div>

            {currentUser ? (
              <div className="p-3 rounded-2xl bg-[#111624] border border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-xs text-slate-950 shrink-0 shadow-md">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-display font-bold text-white truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-mono truncate">
                      Giriş Yapıldı
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] rounded-xl transition-colors"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('login')}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-display font-bold transition-all shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Giriş Yap</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('register')}
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-display font-bold border border-white/10 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Kayıt Ol</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Server & Architecture Status Card */}
        <div className="p-3.5 m-3 rounded-2xl bg-[#0c101c] border border-cyan-500/20 space-y-2 relative z-10">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ubuntu 22.04 LTS</span>
            </span>
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Canlı</span>
            </span>
          </div>

          <div className="w-full bg-[#141a2c] h-1.5 rounded-full overflow-hidden p-0.5">
            <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 h-full rounded-full w-4/5 animate-pulse" />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Nginx + PM2</span>
            <span className="text-cyan-400 font-bold">⚡ yt-dlp & FFmpeg</span>
          </div>
        </div>

      </aside>
    </>
  );
};
