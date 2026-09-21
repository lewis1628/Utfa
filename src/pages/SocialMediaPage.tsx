import React, { useState, useEffect } from 'react';
import { DownloadOption, Platform, VideoMetadata } from '../types';
import { addDownloadHistoryItem, detectPlatform, formatSeconds } from '../utils/storage';
import { DownloadAnimationModal, ActiveDownloadInfo } from '../components/DownloadAnimationModal';
import { 
  Instagram, 
  Facebook, 
  Download, 
  Music, 
  Video, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Clock, 
  Check, 
  Layers,
  HardDrive,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface SocialMediaPageProps {
  initialUrl?: string;
}

export const SocialMediaPage: React.FC<SocialMediaPageProps> = ({ initialUrl = '' }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [activeDownloadModal, setActiveDownloadModal] = useState<ActiveDownloadInfo | null>(null);


  useEffect(() => {
    if (initialUrl && initialUrl.trim()) {
      setUrl(initialUrl);
      const detected = detectPlatform(initialUrl);
      if (detected && detected !== 'youtube') {
        setSelectedPlatform(detected);
      }
      fetchInfo(initialUrl);
    }
  }, [initialUrl]);

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text);
          setError(null);
          const detected = detectPlatform(text);
          if (detected && detected !== 'youtube') {
            setSelectedPlatform(detected);
          }
          fetchInfo(text);
        }
      }
    } catch {
      // ignore
    }
  };

  const handleFillSample = (platform: Platform) => {
    let sample = '';
    if (platform === 'instagram') {
      sample = 'https://www.instagram.com/reel/C3a12b4cdEF/';
    } else if (platform === 'tiktok') {
      sample = 'https://www.tiktok.com/@tiktok/video/7123456789012345678';
    } else if (platform === 'facebook') {
      sample = 'https://www.facebook.com/watch/?v=123456789012345';
    }
    setUrl(sample);
    setSelectedPlatform(platform);
    setError(null);
    fetchInfo(sample);
  };

  const fetchInfo = async (videoUrl: string) => {
    const targetUrl = videoUrl.trim();
    if (!targetUrl) {
      setError('Lütfen geçerli bir sosyal medya bağlantısı girin.');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoInfo(null);

    const platformToSend = selectedPlatform !== 'all' ? selectedPlatform : undefined;

    try {
      const res = await fetch('/api/video-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl, platform: platformToSend }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Sosyal medya videosu çözümlenirken hata oluştu.');
      }

      setVideoInfo(data.data);
      if (data.data.platform && data.data.platform !== 'youtube') {
        setSelectedPlatform(data.data.platform);
      }
    } catch (err: any) {
      setError(err.message || 'Video işlenemedi. Lütfen bağlantıyı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInfo(url);
  };

  const startDownload = async (option: DownloadOption) => {
    if (!videoInfo) return;

    const key = `${option.format}-${option.quality}`;
    setDownloadingFormat(key);
    setDownloadProgress(18);
    const startMsg = `${videoInfo.platform.toUpperCase()} sunucusuna bağlanılıyor, 2πr halkası açılıyor...`;
    setStatusText(startMsg);

    setActiveDownloadModal({
      title: videoInfo.title,
      thumbnail: videoInfo.thumbnail,
      format: option.format,
      quality: option.qualityLabel,
      size: option.sizeEstimate,
      platform: videoInfo.platform,
      progress: 18,
      isComplete: false,
      statusText: startMsg,
    });

    const timer1 = setTimeout(() => {
      setDownloadProgress(50);
      const text = videoInfo.platform === 'tiktok' 
        ? 'TikTok filigranı temizleniyor ve dönüştürülüyor...' 
        : 'HD medya akışı paketleniyor...';
      setStatusText(text);
      setActiveDownloadModal(prev => prev ? ({
        ...prev,
        progress: 50,
        statusText: text,
      }) : null);
    }, 500);

    const timer2 = setTimeout(() => {
      setDownloadProgress(86);
      const text = 'İp gerildi, dosya fırlatılmaya hazırlanıyor!';
      setStatusText(text);
      setActiveDownloadModal(prev => prev ? ({
        ...prev,
        progress: 86,
        statusText: text,
      }) : null);
    }, 1100);

    const timer3 = setTimeout(() => {
      setDownloadProgress(100);
      const text = 'İp düzleşti, dosya gökyüzüne fırlatıldı! 🪂';
      setStatusText(text);
      setActiveDownloadModal(prev => prev ? ({
        ...prev,
        progress: 100,
        isComplete: true,
        statusText: text,
      }) : null);

      addDownloadHistoryItem({
        videoTitle: videoInfo.title,
        thumbnail: videoInfo.thumbnail,
        platform: videoInfo.platform,
        format: option.format,
        quality: option.qualityLabel,
        fileSize: option.sizeEstimate,
        originalUrl: videoInfo.url,
      });

      const downloadUrl = `/api/download?url=${encodeURIComponent(videoInfo.url)}&format=${option.format}&quality=${encodeURIComponent(option.quality)}&title=${encodeURIComponent(videoInfo.title)}`;
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${videoInfo.title}.${option.format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setDownloadingFormat(null);
        setDownloadProgress(0);
        setStatusText('');
      }, 3000);
    }, 1800);
  };

  return (
    <div className="space-y-10 py-4 sm:py-6 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Sosyal Medya Medya Merkezi</span>
          <span className="text-slate-600">•</span>
          <span>Instagram • TikTok • Facebook</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          Sosyal Medya Video & Müzik İndirici
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          TikTok'tan <strong>filigransız (logosuz)</strong> video indirin, Instagram Reels ve Facebook videolarını tek tıkla cihazınıza kaydedin.
        </p>
      </div>

      {/* Platform Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedPlatform('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display font-bold transition-all ${
            selectedPlatform === 'all'
              ? 'bg-white text-slate-950 shadow-lg'
              : 'bg-[#10131d] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Otomatik Algıla (Tümü)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedPlatform('tiktok')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display font-bold transition-all ${
            selectedPlatform === 'tiktok'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/30'
              : 'bg-[#10131d] text-cyan-400 hover:bg-white/[0.04] border border-cyan-500/20'
          }`}
        >
          <span className="font-mono text-sm">TT</span>
          <span>TikTok (Filigransız)</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/20 font-mono">No-WM</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedPlatform('instagram')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display font-bold transition-all ${
            selectedPlatform === 'instagram'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30'
              : 'bg-[#10131d] text-pink-400 hover:bg-white/[0.04] border border-pink-500/20'
          }`}
        >
          <Instagram className="w-4 h-4" />
          <span>Instagram Reels</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedPlatform('facebook')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display font-bold transition-all ${
            selectedPlatform === 'facebook'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-[#10131d] text-blue-400 hover:bg-white/[0.04] border border-blue-500/20'
          }`}
        >
          <Facebook className="w-4 h-4" />
          <span>Facebook Watch</span>
        </button>
      </div>

      {/* URL INPUT FORM */}
      <div className="rounded-3xl bg-[#0f121d] border border-white/[0.09] p-4 sm:p-6 shadow-2xl space-y-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 p-2 bg-[#141824] rounded-2xl border border-white/10 focus-within:border-purple-500 transition-all duration-200">
            
            <div className="pl-3 text-purple-400 hidden sm:flex items-center">
              {selectedPlatform === 'tiktok' ? (
                <span className="font-bold text-cyan-400 font-mono text-sm">TT</span>
              ) : selectedPlatform === 'instagram' ? (
                <Instagram className="w-6 h-6 text-pink-500" />
              ) : selectedPlatform === 'facebook' ? (
                <Facebook className="w-6 h-6 text-blue-500" />
              ) : (
                <Sparkles className="w-6 h-6 text-purple-400" />
              )}
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              placeholder={
                selectedPlatform === 'tiktok'
                  ? 'TikTok video bağlantısını buraya yapıştırın...'
                  : selectedPlatform === 'instagram'
                  ? 'Instagram Reels veya gönderi linkini yapıştırın...'
                  : selectedPlatform === 'facebook'
                  ? 'Facebook video veya Watch linkini yapıştırın...'
                  : 'TikTok, Instagram veya Facebook video linki yapıştırın...'
              }
              className="w-full bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm px-3 py-2.5 focus:outline-none"
              id="social-url-input"
            />

            <button
              type="button"
              onClick={handlePasteClipboard}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold shrink-0 transition-all border border-white/5"
              title="Panodan Yapıştır"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Yapıştır</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              id="social-fetch-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:opacity-90 text-white font-display font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 shrink-0 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>İşleniyor...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Videoyu Getir</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Sample Links */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 px-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500">Örnek Bağlantı Dene:</span>
            <button
              type="button"
              onClick={() => handleFillSample('tiktok')}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 transition-colors font-medium text-[11px]"
            >
              TikTok Örneği
            </button>
            <button
              type="button"
              onClick={() => handleFillSample('instagram')}
              className="px-2.5 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/20 transition-colors font-medium text-[11px]"
            >
              Instagram Reels Örneği
            </button>
            <button
              type="button"
              onClick={() => handleFillSample('facebook')}
              className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 transition-colors font-medium text-[11px]"
            >
              Facebook Video Örneği
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            Filigransız Motor: Aktif
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}
      </div>

      {/* DOWNLOAD PROGRESS HUD */}
      {downloadingFormat && (
        <div className="rounded-3xl bg-[#141824] border border-purple-500/40 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2 text-purple-400 font-mono">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span>{statusText}</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-white bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30 font-bold">%{downloadProgress}</span>
            </div>
          </div>

          <div className="w-full h-3 bg-[#0a0d14] rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-400 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* VIDEO METADATA & DOWNLOAD OPTIONS */}
      {videoInfo && (
        <div className="rounded-3xl bg-[#0f121d] border border-white/[0.09] p-6 sm:p-8 shadow-2xl space-y-8">
          
          <div className="flex flex-col md:flex-row gap-6 items-start pb-6 border-b border-white/[0.07]">
            {/* Thumbnail */}
            <div className="relative w-full md:w-80 aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10 group shrink-0">
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-mono text-white">
                <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 font-bold">
                  {formatSeconds(videoInfo.duration)}
                </span>
                <span className="px-2.5 py-0.5 rounded font-bold uppercase text-[10px] bg-purple-600 text-white">
                  {videoInfo.platform}
                </span>
              </div>
            </div>

            {/* Video Details */}
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {videoInfo.platform === 'tiktok' ? 'Filigransız Mod Aktif' : 'HD Akış Hazır'}
                  </span>
                </div>

                <h2 className="font-display font-extrabold text-lg sm:text-2xl text-white leading-snug">
                  {videoInfo.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/5">
                  <span className="text-slate-500">Yayınlayan:</span>
                  <strong className="text-white">{videoInfo.author}</strong>
                </div>

                <div className="flex items-center gap-2 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/5">
                  <span className="text-slate-500">Platform:</span>
                  <strong className="text-white capitalize">{videoInfo.platform}</strong>
                </div>

                <a
                  href={videoInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-semibold"
                >
                  <span>Orijinal Bağlantıyı Aç</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Download Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-lg text-white">
                Kullanılabilir İndirme Formatları
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {videoInfo.options.length} Seçenek Mevcut
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videoInfo.options.map((opt, idx) => {
                const isDownloading = downloadingFormat === `${opt.format}-${opt.quality}`;
                const isNoWatermark = opt.quality.includes('nowatermark');
                return (
                  <div
                    key={idx}
                    className={`relative rounded-2xl p-5 bg-[#141824] border transition-all duration-200 flex flex-col justify-between space-y-4 hover:bg-[#181d2c] ${
                      isNoWatermark ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10' : 'border-white/[0.08]'
                    }`}
                  >
                    {isNoWatermark && (
                      <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-mono text-[9px] font-black shadow">
                        FİLİGRANSIZ (NO WATERMARK)
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-display font-black text-xl text-white">
                          {opt.qualityLabel}
                        </span>
                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          opt.format === 'mp3' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                        }`}>
                          {opt.format}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400">
                        {opt.resolution || (opt.format === 'mp3' ? 'Ses Akışı' : 'Video')}
                      </div>

                      <div className="text-xs font-mono text-slate-300 flex items-center gap-1.5 pt-1">
                        <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                        <span>Boyut: <strong>{opt.sizeEstimate}</strong></span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!!downloadingFormat}
                      onClick={() => startDownload(opt)}
                      className={`w-full py-2.5 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        isNoWatermark
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-500/30'
                          : opt.format === 'mp3'
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white'
                      } disabled:opacity-50`}
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>{opt.qualityLabel} İndir</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* PLATFORM CARDS FEATURE HIGHLIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-2xl bg-[#0f121d] border border-cyan-500/20 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-display font-bold text-sm">
            <span className="font-mono text-base font-black">TT</span>
            <span>TikTok Filigran Temizleyici</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            TikTok videolarındaki kullanıcı adı ve platform logosu otomatik silinerek tertemiz HD video elde edilir.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f121d] border border-pink-500/20 space-y-2">
          <div className="flex items-center gap-2 text-pink-400 font-display font-bold text-sm">
            <Instagram className="w-4 h-4" />
            <span>Instagram 1080p Reels</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Reels, carousel ve video gönderilerini sıkıştırmadan, paylaşıldığı orijinal bit hızında ve sesle indirin.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f121d] border border-blue-500/20 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-display font-bold text-sm">
            <Facebook className="w-4 h-4" />
            <span>Facebook Watch & Reels</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Facebook genel veya grup paylaşımlarındaki uzun videoları veya Reels kliplerini HD kalitede dönüştürün.
          </p>
        </div>
      </div>

      {/* 2πr Ring Unrolls & Slingshot Sky Launch Modal */}
      <DownloadAnimationModal
        activeDownload={activeDownloadModal}
        onClose={() => setActiveDownloadModal(null)}
      />

    </div>
  );
};
