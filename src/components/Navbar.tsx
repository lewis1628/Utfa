import React from 'react';
import { PageView, User } from '../types';
import { 
  Download, 
  History, 
  LogIn, 
  UserPlus, 
  Zap,
  Menu
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  currentUser: User | null;
  historyCount: number;
  onOpenSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  historyCount,
  onOpenSidebar,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090b10]/95 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Left: Brand Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
            id="navbar-logo"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-rose-600 flex items-center justify-center shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <Download className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-base sm:text-lg text-white tracking-tight">
                Vidi<span className="text-cyan-400">Load</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                PRO
              </span>
            </div>
          </div>

          {/* Center: Direct Quick Switchers (Desktop) */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => onNavigate('youtube')}
              className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                currentPage === 'youtube'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-white/[0.03] text-slate-400 border-white/5 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>YouTube 4K & MP3</span>
            </button>

            <button
              onClick={() => onNavigate('social')}
              className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                currentPage === 'social'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-white/[0.03] text-slate-400 border-white/5 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <span>TikTok (Filigransız) & IG</span>
            </button>

            <button
              onClick={() => onNavigate('vps')}
              className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                currentPage === 'vps'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/[0.03] text-slate-400 border-white/5 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <span>Ubuntu 22.04 VPS</span>
            </button>
          </div>

          {/* Right: History + User + Electric Menu Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Download History Shortcut */}
            <button
              id="nav-history-btn"
              onClick={() => onNavigate('history')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                currentPage === 'history'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-[#10131d] text-slate-300 border-white/[0.08] hover:bg-white/[0.05] hover:text-white'
              }`}
              title="İndirme Geçmişi"
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Geçmiş</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-cyan-500 text-slate-950 font-black">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Desktop Auth Button if not logged in */}
            {!currentUser && (
              <button
                id="nav-login-btn"
                onClick={() => onNavigate('login')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Giriş</span>
              </button>
            )}

            {/* Logged in Avatar (Desktop) */}
            {currentUser && (
              <div 
                onClick={() => onNavigate('history')}
                className="hidden sm:flex items-center gap-2 p-1 pl-2.5 bg-[#10131d] border border-cyan-500/20 rounded-xl cursor-pointer hover:border-cyan-500/40 transition-colors"
                title="Kullanıcı Profili & Geçmiş"
              >
                <span className="text-xs font-bold text-slate-200 max-w-[80px] truncate">
                  {currentUser.name}
                </span>
                <div className="w-6 h-6 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center text-xs font-black">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* ELECTRIC MENU BUTTON (Right Side) ⚡ */}
            <button
              type="button"
              onClick={onOpenSidebar}
              id="navbar-open-sidebar"
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/15 via-blue-600/15 to-purple-600/15 hover:from-cyan-500/25 hover:to-purple-600/25 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all group active:scale-95"
              title="Elektrikli Yan Menüyü Aç"
            >
              <Zap className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform animate-spark-flash" />
              <span className="text-xs font-display font-bold">Menü</span>
              <Menu className="w-3.5 h-3.5 text-cyan-300 opacity-80" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
