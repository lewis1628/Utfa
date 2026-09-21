import React, { useState, useEffect } from 'react';
import { DownloadHistoryItem, PageView, User } from '../types';
import { clearDownloadHistory, getDownloadHistory } from '../utils/storage';
import { 
  History, 
  Trash2, 
  Download, 
  ExternalLink, 
  Clock, 
  Music, 
  Video, 
  Youtube, 
  Instagram, 
  Facebook, 
  Share2,
  FolderOpen,
  ArrowRight,
  HardDrive
} from 'lucide-react';

interface HistoryPageProps {
  onNavigate: (page: PageView) => void;
  currentUser: User | null;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate, currentUser }) => {
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getDownloadHistory());
  }, []);

  const handleClear = () => {
    if (window.confirm('Tüm indirme geçmişini silmek istediğinizden emin misiniz?')) {
      clearDownloadHistory();
      setHistory([]);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-rose-500" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'tiktok':
        return <span className="font-bold text-xs text-cyan-400 font-mono">TT</span>;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-500" />;
      default:
        return <Share2 className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 py-4 sm:py-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs text-rose-400 font-mono font-bold mb-1">
            <History className="w-4 h-4" />
            <span>Kullanıcı İndirme Arşivi</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white">İndirilen Dosyalar</h1>
          <p className="text-xs text-slate-400 mt-1">
            {currentUser ? `Hoş geldin ${currentUser.name}! ` : ''}
            Daha önce dönüştürdüğünüz video ve müzikleri doğrudan buradan yönetebilir ve yeniden indirebilirsiniz.
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/40 text-xs font-semibold transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Geçmişi Temizle</span>
          </button>
        )}
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="rounded-[2.5rem] bg-[#0f121d] border border-white/[0.08] p-12 sm:p-16 text-center space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/10 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
            <FolderOpen className="w-10 h-10 stroke-[1.2]" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-display font-bold text-lg text-white">Henüz İndirilen Dosya Yok</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              YouTube, Instagram, TikTok veya Facebook üzerinden dönüştürdüğünüz tüm MP3 ve MP4 dosyaları burada listelenir.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('youtube')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-display font-bold shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
            >
              <span>İlk Videonu Dönüştür</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#0f121d] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-200 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-24 sm:w-28 aspect-video rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/10">
                  <img
                    src={item.thumbnail}
                    alt={item.videoTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 left-1 p-1 rounded-md bg-black/80 backdrop-blur-sm border border-white/10">
                    {getPlatformIcon(item.platform)}
                  </div>
                </div>

                <div className="min-w-0 space-y-1.5">
                  <h4 className="font-display font-bold text-sm sm:text-base text-white truncate max-w-xl group-hover:text-rose-300 transition-colors">
                    {item.videoTitle}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1 font-bold text-slate-200">
                      {item.format === 'mp3' ? <Music className="w-3.5 h-3.5 text-amber-400" /> : <Video className="w-3.5 h-3.5 text-rose-400" />}
                      <span className="uppercase">{item.format}</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-300">{item.quality}</span>
                    {item.fileSize && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <HardDrive className="w-3 h-3" />
                          {item.fileSize}
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleDateString('tr-TR')} {new Date(item.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <a
                  href={`/api/download?url=${encodeURIComponent(item.originalUrl)}&format=${item.format}&quality=${encodeURIComponent(item.quality)}&title=${encodeURIComponent(item.videoTitle)}`}
                  download={`${item.videoTitle}.${item.format}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-display font-bold transition-all shadow-md shadow-rose-600/20 hover:scale-105"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Tekrar İndir</span>
                </a>
                <a
                  href={item.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors border border-white/5"
                  title="Orijinal Bağlantıyı Aç"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
