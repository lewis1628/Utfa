import React, { useState, useEffect } from 'react';
import { DownloadOption, VideoMetadata } from '../types';
import { addDownloadHistoryItem, formatSeconds, formatViewCount } from '../utils/storage';
import { DownloadAnimationModal, ActiveDownloadInfo } from '../components/DownloadAnimationModal';
import { 
  Youtube, 
  Download, 
  Music, 
  Video, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Clock, 
  Eye, 
  SlidersHorizontal,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  Share2,
  HardDrive,
  ShieldCheck,
  Check,
  Zap
} from 'lucide-react';

interface YouTubePageProps {
  initialUrl?: string;
  onNavigateHistory?: () => void;
}

export const YouTubePage: React.FC<YouTubePageProps> = ({ initialUrl = '', onNavigateHistory }) => {
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [downloadSpeed, setDownloadSpeed] = useState<string>('0 MB/s');
  const [activeDownloadModal, setActiveDownloadModal] = useState<ActiveDownloadInfo | null>(null);

  // Interactive audio preview player state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);


  useEffect(() => {
    if (initialUrl && initialUrl.trim()) {
      setUrl(initialUrl);
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
          fetchInfo(text);
        }
      }
    } catch {
      // ignore
    }
  };

  const handleFillSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setError(null);
    fetchInfo(sampleUrl);
  };

  const fetchInfo = async (videoUrl: string) => {
    const targetUrl = videoUrl.trim();
    if (!targetUrl) {
      setError('Lütfen geçerli bir YouTube video veya Shorts bağlantısı girin.');
      return;
    }

    if (!targetUrl.includes('youtube.com') && !targetUrl.includes('youtu.be')) {
      setError('Geçersiz bağlantı! Lütfen youtube.com veya youtu.be uzantılı bir link yazın.');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoInfo(null);
    setIsPlayingAudio(false);

    try {
      const res = await fetch('/api/video-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl, platform: 'youtube' }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Video bilgileri sunucudan alınamadı.');
      }

      setVideoInfo(data.data);
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
    setDownloadSpeed('14.2 MB/s');
    setStatusText('Halka açılıyor (2πr), sunucuya bağlanılıyor...');

    // Open the viral 2πr unroll + slingshot launch animation modal
    setActiveDownloadModal({
      title: videoInfo.title,
      thumbnail: videoInfo.thumbnail,
      format: option.format,
      quality: option.qualityLabel,
      size: option.sizeEstimate,
      platform: 'youtube',
      progress: 18,
      isComplete: false,
      statusText: 'Halka açılıyor (2πr), FFmpeg motoru başlatılıyor...',
    });

    const timer1 = setTimeout(() => {
      setDownloadProgress(52);
      setDownloadSpeed('22.8 MB/s');
      const text = option.format === 'mp3' ? 'FFmpeg ile MP3 320kbps ses akışı ayıklanıyor...' : 'Video ve ses akışları Full HD birleştiriliyor...';
      setStatusText(text);
      setActiveDownloadModal(prev => prev ? ({
        ...prev,
        progress: 52,
        statusText: text,
      }) : null);
    }, 500);

    const timer2 = setTimeout(() => {
      setDownloadProgress(88);
      setDownloadSpeed('31.4 MB/s');
      const text = 'İp geriliyor, medya paketi fırlatılmaya hazır!';
      setStatusText(text);
      setActiveDownloadModal(prev => prev ? ({
        ...prev,
        progress: 88,
        statusText: text,
      }) : null);
    }, 1100);

    const timer3 = setTimeout(() => {
      setDownloadProgress(100);
      setDownloadSpeed('Tamamlandı');
      const text = 'İp düzleşti, dosya gökyüzüne fırlatıldı! 🪂';
      setStatusText(text);
      setActiveDownloadModal(prev => prev ? ({
        ...prev,
        progress: 100,
        isComplete: true,
        statusText: text,
      }) : null);

      // Save to download history
      addDownloadHistoryItem({
        videoTitle: videoInfo.title,
        thumbnail: videoInfo.thumbnail,
        platform: 'youtube',
        format: option.format,
        quality: option.qualityLabel,
        fileSize: option.sizeEstimate,
        originalUrl: videoInfo.url,
      });

      // Trigger download
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

  // Filter video & audio options
  const videoOptions = videoInfo?.options.filter(o => o.format === 'mp4') || [];
  const audioOptions = videoInfo?.options.filter(o => o.format === 'mp3') || [];

  return (
    <div className="space-y-10 py-4 sm:py-6 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold">
          <Youtube className="w-4 h-4 text-rose-500" />
          <span>YouTube Studio Transcoder</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            yt-dlp Aktif
          </span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          YouTube Video & MP3 İndirici
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          YouTube videolarını veya Shorts kliplerini <strong>MP4 (1080p/4K)</strong> ve stüdyo berraklığında <strong>MP3 (320 kbps)</strong> formatında cihazınıza kaydedin.
        </p>
      </div>

      {/* URL INPUT FORM */}
      <div className="rounded-3xl bg-[#0f121d] border border-white/[0.09] p-4 sm:p-6 shadow-2xl space-y-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 p-2 bg-[#141824] rounded-2xl border border-white/10 focus-within:border-rose-500 transition-all duration-200">
            
            <div className="pl-3 text-rose-500 hidden sm:flex items-center">
              <Youtube className="w-6 h-6 shrink-0" />
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              placeholder="YouTube veya Shorts linkini buraya yapıştırın..."
              className="w-full bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm px-3 py-2.5 focus:outline-none"
              id="youtube-url-input"
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
              id="youtube-fetch-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-display font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/30 shrink-0 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>İşleniyor...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Bilgileri Getir</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Sample Link Buttons */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 px-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500">Hazır Test Linkleri:</span>
            <button
              type="button"
              onClick={() => handleFillSample('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-rose-300 border border-white/5 transition-colors font-medium text-[11px]"
            >
              Rick Astley (4K Video)
            </button>
            <button
              type="button"
              onClick={() => handleFillSample('https://www.youtube.com/shorts/kJQP7kiw5Fk')}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-red-300 border border-white/5 transition-colors font-medium text-[11px]"
            >
              Shorts Dikey Video
            </button>
            <button
              type="button"
              onClick={() => handleFillSample('https://www.youtube.com/watch?v=jfKfPfyJRdk')}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-amber-300 border border-white/5 transition-colors font-medium text-[11px]"
            >
              Lofi Girl (Müzik MP3)
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            Otomatik Format Algılama: Aktif
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}
      </div>

      {/* DOWNLOAD PROGRESS HUD (When in progress) */}
      {downloadingFormat && (
        <div className="rounded-3xl bg-gradient-to-r from-[#141824] to-[#111420] border border-rose-500/40 p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2 text-rose-400 font-mono">
              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
              <span>{statusText}</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-slate-400">Hız: <strong className="text-emerald-400">{downloadSpeed}</strong></span>
              <span className="text-white bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30 font-bold">%{downloadProgress}</span>
            </div>
          </div>

          {/* Progress track */}
          <div className="w-full h-3 bg-[#0a0d14] rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-400 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>FFmpeg 6.0 Transcoding Engine</span>
            <span>Tarayıcı indirme kutusu otomatik açılacaktır</span>
          </div>
        </div>
      )}

      {/* VIDEO METADATA & FORMAT SELECTION */}
      {videoInfo && (
        <div className="rounded-3xl bg-[#0f121d] border border-white/[0.09] p-6 sm:p-8 shadow-2xl space-y-8">
          
          {/* Top Video Showcase Card */}
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
                <span className="px-2 py-0.5 rounded bg-rose-600/90 font-bold">
                  YouTube
                </span>
              </div>
            </div>

            {/* Video Details */}
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    Orijinal Kalite
                  </span>
                  {videoInfo.views && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Eye className="w-3.5 h-3.5" />
                      {formatViewCount(videoInfo.views)} Görüntülenme
                    </span>
                  )}
                </div>

                <h2 className="font-display font-extrabold text-lg sm:text-2xl text-white leading-snug">
                  {videoInfo.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/5">
                  <span className="text-slate-500">Kanal:</span>
                  <strong className="text-white">{videoInfo.author}</strong>
                </div>

                <div className="flex items-center gap-2 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/5">
                  <span className="text-slate-500">Süre:</span>
                  <strong className="text-white font-mono">{formatSeconds(videoInfo.duration)}</strong>
                </div>

                <a
                  href={videoInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-semibold"
                >
                  <span>YouTube'da Aç</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Live Audio Waveform Preview simulation */}
              <div className="p-3 rounded-2xl bg-[#141824] border border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-600/30 transition-all shrink-0"
                    title={isPlayingAudio ? 'Durdur' : 'Sesi Dinle'}
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white translate-x-0.5" />}
                  </button>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Canlı Ses Önizleme Dalgası</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {isPlayingAudio ? 'Ses akışı test ediliyor...' : 'MP3 indirmeden önce sesi dinleyin'}
                    </div>
                  </div>
                </div>

                {/* Animated Waveform Visualizer */}
                <div className="flex items-center gap-1 h-6 shrink-0 pr-2">
                  {[40, 75, 55, 90, 65, 80, 45, 100, 60, 85, 50, 70, 95, 60].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isPlayingAudio ? 'bg-rose-500 animate-pulse' : 'bg-slate-700'
                      }`}
                      style={{
                        height: isPlayingAudio ? `${Math.max(20, (h * ((i % 3) + 1)) % 100)}%` : '20%',
                        animationDelay: `${i * 80}ms`
                      }}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Format Selector Tabs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 bg-[#141824] p-1.5 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-display font-bold transition-all ${
                    activeTab === 'video'
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Video İndir (MP4)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/20">
                    {videoOptions.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('audio')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-display font-bold transition-all ${
                    activeTab === 'audio'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Music className="w-4 h-4" />
                  <span>Müzik & Ses İndir (MP3)</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20">
                    {audioOptions.length}
                  </span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>FFmpeg Kayıpsız Kodek</span>
              </div>
            </div>

            {/* VIDEO OPTIONS GRID */}
            {activeTab === 'video' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {videoOptions.map((opt, idx) => {
                  const isDownloading = downloadingFormat === `${opt.format}-${opt.quality}`;
                  const isBest = opt.quality === '1080p';
                  return (
                    <div
                      key={idx}
                      className={`relative rounded-2xl p-5 bg-[#141824] border transition-all duration-200 flex flex-col justify-between space-y-4 hover:bg-[#181d2c] ${
                        isBest ? 'border-rose-500/40 shadow-lg shadow-rose-600/10' : 'border-white/[0.08]'
                      }`}
                    >
                      {isBest && (
                        <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-mono text-[9px] font-bold shadow">
                          EN POPÜLER
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-black text-xl text-white">
                            {opt.qualityLabel}
                          </span>
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/5">
                            {opt.format}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 font-medium">
                          {opt.resolution || 'Standart Çözünürlük'}
                        </div>

                        <div className="text-xs font-mono text-slate-300 flex items-center gap-1.5 pt-1">
                          <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                          <span>Tahmini Boyut: <strong>{opt.sizeEstimate}</strong></span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={!!downloadingFormat}
                        onClick={() => startDownload(opt)}
                        className={`w-full py-2.5 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          isBest
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                            : 'bg-white/[0.07] hover:bg-white/[0.14] text-white'
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
            )}

            {/* AUDIO OPTIONS GRID */}
            {activeTab === 'audio' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {audioOptions.map((opt, idx) => {
                  const isDownloading = downloadingFormat === `${opt.format}-${opt.quality}`;
                  const isStudio = opt.quality === '320kbps';
                  return (
                    <div
                      key={idx}
                      className={`relative rounded-2xl p-5 bg-[#141824] border transition-all duration-200 flex flex-col justify-between space-y-4 hover:bg-[#181d2c] ${
                        isStudio ? 'border-amber-500/40 shadow-lg shadow-amber-500/10' : 'border-white/[0.08]'
                      }`}
                    >
                      {isStudio && (
                        <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-mono text-[9px] font-black shadow">
                          STÜDYO HI-FI
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-black text-xl text-white">
                            {opt.qualityLabel}
                          </span>
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            MP3 SES
                          </span>
                        </div>

                        <div className="text-xs text-slate-400">
                          {isStudio ? 'Kayıpsız 320 kbps CBR Stereo Ses' : 'Yüksek Kalite MP3 Müzik'}
                        </div>

                        <div className="text-xs font-mono text-slate-300 flex items-center gap-1.5 pt-1">
                          <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                          <span>Tahmini Boyut: <strong>{opt.sizeEstimate}</strong></span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={!!downloadingFormat}
                        onClick={() => startDownload(opt)}
                        className={`w-full py-2.5 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          isStudio
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/30'
                            : 'bg-white/[0.07] hover:bg-white/[0.14] text-white'
                        } disabled:opacity-50`}
                      >
                        {isDownloading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Music className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>{opt.quality} MP3 İndir</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      )}

      {/* FOOTER INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-2xl bg-[#0f121d] border border-white/[0.06] space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-display font-bold text-sm">
            <Youtube className="w-4 h-4" />
            <span>Shorts Videoları Desteği</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Standart YouTube videolarının yanı sıra dikey formatta yüklenen tüm Shorts videolarını da otomatik algılar ve dönüştürür.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f121d] border border-white/[0.06] space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-display font-bold text-sm">
            <Music className="w-4 h-4" />
            <span>320 kbps Stüdyo Çıkışı</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Videodaki ses kanalı FFmpeg ile filtrelenip en yüksek bit hızında ID3 etiketleriyle birlikte MP3 dosyasına kaydedilir.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f121d] border border-white/[0.06] space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Reklamsız & Güvenli</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pop-up reklamlar, sahte yönlendirmeler veya virüs riski olmadan doğrudan temiz dosya bağlantısı teslim edilir.
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
