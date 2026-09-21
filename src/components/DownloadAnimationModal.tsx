import React from 'react';
import { UnrollDownloadAnimation } from './UnrollDownloadAnimation';
import { X, CheckCircle, ArrowDownCircle, ExternalLink, HardDrive } from 'lucide-react';

export interface ActiveDownloadInfo {
  title: string;
  thumbnail?: string;
  format: string;
  quality: string;
  size?: string;
  platform?: string;
  progress: number; // 0 to 100
  isComplete: boolean;
  statusText?: string;
}

interface DownloadAnimationModalProps {
  activeDownload: ActiveDownloadInfo | null;
  onClose: () => void;
}

export const DownloadAnimationModal: React.FC<DownloadAnimationModalProps> = ({
  activeDownload,
  onClose,
}) => {
  if (!activeDownload) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl bg-[#0a0d16] border border-cyan-500/30 p-5 sm:p-7 shadow-[0_0_50px_rgba(0,240,255,0.2)] relative space-y-5"
        id="download-reel-modal"
      >
        {/* Top Header with Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-md">
              ⚡
            </div>
            <div>
              <h3 className="font-display font-black text-sm sm:text-base text-white">
                İndirme ve Dönüştürme Motoru
              </h3>
              <p className="text-[10px] text-cyan-400 font-mono">
                Ring Unroll & Slingshot Launch 🪂
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors border border-white/5"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Media Information Capsule */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#101524] border border-white/5">
          {activeDownload.thumbnail ? (
            <img
              src={activeDownload.thumbnail}
              alt=""
              className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold shrink-0">
              {activeDownload.format.toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-1">
            <div className="text-xs font-display font-bold text-white truncate">
              {activeDownload.title}
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="text-cyan-400 font-bold">{activeDownload.quality}</span>
              <span>•</span>
              <span className="uppercase text-slate-300">{activeDownload.format}</span>
              {activeDownload.size && (
                <>
                  <span>•</span>
                  <span>{activeDownload.size}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* THE UNROLLING RING ANIMATION */}
        <UnrollDownloadAnimation
          isDownloading={true}
          progress={activeDownload.progress}
          title={activeDownload.title}
          fileType={activeDownload.format === 'mp3' ? 'audio' : 'video'}
          quality={activeDownload.quality}
          size={activeDownload.size}
        />

        {/* Status text & details */}
        <div className="text-center space-y-1">
          <div className="text-xs font-mono font-bold text-slate-300">
            {activeDownload.statusText || 'Dosya işleniyor...'}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {activeDownload.isComplete
              ? 'Dosya tarayıcınıza kaydedildi, arşivinize eklendi.'
              : 'yt-dlp & FFmpeg yüksek hızda veriyi derliyor.'}
          </div>
        </div>

        {/* Bottom Actions */}
        {activeDownload.isComplete && (
          <div className="pt-2 flex items-center justify-center">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-display font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Harika, Kapat</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
