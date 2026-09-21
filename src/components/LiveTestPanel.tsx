import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Zap, 
  Play, 
  Loader2, 
  Server, 
  Cpu, 
  HardDrive,
  X
} from 'lucide-react';

interface LiveTestPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTestUrl?: (url: string, platform: 'youtube' | 'social') => void;
}

interface DiagnosticData {
  status: string;
  uptimeSeconds: number;
  environment: {
    node: string;
    platform: string;
    arch: string;
    memoryRssMb: number;
    memoryHeapMb: number;
  };
  tools: {
    ytDlp: {
      installed: boolean;
      binaryPath: string;
      version: string;
    };
    ffmpeg: {
      installed: boolean;
      binaryPath: string;
      version: string;
    };
    nodeRuntime: {
      binaryPath: string;
    };
  };
  readyForTesting: boolean;
}

export const LiveTestPanel: React.FC<LiveTestPanelProps> = ({
  isOpen,
  onClose,
  onSelectTestUrl
}) => {
  const [data, setData] = useState<DiagnosticData | null>(null);
  const [loading, setLoading] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testLog, setTestLog] = useState<{ time: string; text: string; success?: boolean }[]>([]);
  const [runningTest, setRunningTest] = useState(false);

  const fetchDiagnostics = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/test-diagnostic');
      const json = await res.json();
      const end = performance.now();
      setPingLatency(Math.round(end - start));
      setData(json);
      addLog(`Sistem teşhisi başarıyla alındı (${Math.round(end - start)} ms)`, true);
    } catch (err: any) {
      addLog(`Teşhis hatası: ${err.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDiagnostics();
    }
  }, [isOpen]);

  const addLog = (text: string, success?: boolean) => {
    const time = new Date().toLocaleTimeString();
    setTestLog((prev) => [{ time, text, success }, ...prev.slice(0, 15)]);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const runSampleApiTest = async (testType: 'youtube' | 'stream') => {
    setRunningTest(true);
    addLog(`Test başlatılıyor: ${testType.toUpperCase()}...`);

    try {
      if (testType === 'youtube') {
        const start = performance.now();
        const res = await fetch('/api/video-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            platform: 'youtube'
          })
        });
        const result = await res.json();
        const duration = Math.round(performance.now() - start);

        if (result.success && result.data) {
          addLog(`✅ YouTube 4K Analiz Başarılı (${duration} ms): "${result.data.title?.substring(0, 30)}..." [${result.data.options?.length || 0} Format]`, true);
        } else {
          addLog(`⚠️ Analiz Uyarısı: ${result.error || 'Veri alınamadı'}`, false);
        }
      } else {
        const start = performance.now();
        const res = await fetch('/api/health');
        const result = await res.json();
        const duration = Math.round(performance.now() - start);
        addLog(`✅ API Sağlık Pingi: ${result.status} (${duration} ms) - yt-dlp: ${result.hasYtDlp ? 'Aktif' : 'Pasif'}, ffmpeg: ${result.hasFfmpeg ? 'Aktif' : 'Pasif'}`, true);
      }
    } catch (err: any) {
      addLog(`❌ Test Hatası: ${err.message}`, false);
    } finally {
      setRunningTest(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0b0e17] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0e121e]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm sm:text-base text-white flex items-center gap-2">
                <span>Canlı Test &amp; Sunucu Teşhis Merkezi</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  GitHub Ready
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Canlıya alma öncesi motor durumu, sistem latency'si ve hızlı test akışları
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDiagnostics}
              disabled={loading}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/5 transition-all disabled:opacity-50"
              title="Yenile"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white border border-white/5 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Status Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* yt-dlp */}
            <div className="p-3.5 rounded-2xl bg-[#121624] border border-white/[0.07] space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>yt-dlp Motoru</span>
                {data?.tools.ytDlp.installed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-amber-400" />
                )}
              </div>
              <div className="text-xs font-display font-bold text-white truncate">
                {data?.tools.ytDlp.installed ? data.tools.ytDlp.version : 'Kontrol Ediliyor...'}
              </div>
              <div className="text-[10px] text-slate-500 truncate font-mono">
                {data?.tools.ytDlp.binaryPath || 'Hazır'}
              </div>
            </div>

            {/* FFmpeg */}
            <div className="p-3.5 rounded-2xl bg-[#121624] border border-white/[0.07] space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>FFmpeg Transcoder</span>
                {data?.tools.ffmpeg.installed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-amber-400" />
                )}
              </div>
              <div className="text-xs font-display font-bold text-white truncate">
                {data?.tools.ffmpeg.installed ? 'libavcodec Aktif' : 'Kontrol Ediliyor...'}
              </div>
              <div className="text-[10px] text-slate-500 truncate font-mono">
                320kbps MP3 &amp; 4K MP4
              </div>
            </div>

            {/* Node Runtime */}
            <div className="p-3.5 rounded-2xl bg-[#121624] border border-white/[0.07] space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Node.js / Platform</span>
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xs font-display font-bold text-white truncate">
                {data?.environment.node || process.version}
              </div>
              <div className="text-[10px] text-slate-500 truncate font-mono">
                {data?.environment.platform} ({data?.environment.arch})
              </div>
            </div>

            {/* Latency */}
            <div className="p-3.5 rounded-2xl bg-[#121624] border border-white/[0.07] space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>API Ping Süresi</span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xs font-display font-bold text-emerald-400">
                {pingLatency !== null ? `${pingLatency} ms` : '...'}
              </div>
              <div className="text-[10px] text-slate-500 truncate font-mono">
                Bellek: {data?.environment.memoryRssMb || 0} MB RSS
              </div>
            </div>
          </div>

          {/* Quick Real Test Action Buttons */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Canlı Test Eylemleri</span>
              <span className="text-[10px] text-slate-500 font-normal">Tek tıkla gerçek analiz testi yürüt</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => runSampleApiTest('youtube')}
                disabled={runningTest}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/40 to-[#161a28] hover:from-rose-900/50 hover:to-[#1a2032] border border-rose-500/30 text-white text-xs font-bold transition-all group disabled:opacity-50 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                    <Play className="w-3.5 h-3.5 fill-rose-400" />
                  </div>
                  <div>
                    <div className="text-white">YouTube 4K Testi Yap</div>
                    <div className="text-[10px] text-slate-400 font-normal">Never Gonna Give You Up (4K Video)</div>
                  </div>
                </div>
                <Zap className="w-4 h-4 text-rose-400 opacity-70 group-hover:scale-110 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => runSampleApiTest('stream')}
                disabled={runningTest}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-[#161a28] hover:from-cyan-900/50 hover:to-[#1a2032] border border-cyan-500/30 text-white text-xs font-bold transition-all group disabled:opacity-50 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-white">Sunucu Sağlık Pingi At</div>
                    <div className="text-[10px] text-slate-400 font-normal">GET /api/health kontrolü</div>
                  </div>
                </div>
                <Zap className="w-4 h-4 text-cyan-400 opacity-70 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Test Live Output Console */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Canlı Teşhis &amp; Çıktı Konsolu</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Son olaylar</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] font-mono text-[11px] space-y-1.5 max-h-36 overflow-y-auto select-text">
              {testLog.length === 0 ? (
                <div className="text-slate-500 italic">Henüz test çalıştırılmadı. Yukarıdaki test butonlarına basabilirsiniz.</div>
              ) : (
                testLog.map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-slate-600 shrink-0">[{log.time}]</span>
                    <span className={log.success === true ? 'text-emerald-400' : log.success === false ? 'text-rose-400' : 'text-slate-300'}>
                      {log.text}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* GitHub / VPS Deployment Quick Cheatsheet */}
          <div className="p-4 rounded-2xl bg-[#121624] border border-white/[0.07] space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-indigo-400" />
                <span>GitHub'a Yükleyip Sunucuda Başlatma Komutları</span>
              </div>
              <span className="text-[10px] text-indigo-300 font-mono">setup.sh &amp; Dockerfile hazır</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5 font-mono text-[11px] text-slate-300">
                <span className="text-emerald-400">git clone &lt;repo&gt; &amp;&amp; npm install &amp;&amp; npm start</span>
                <button
                  onClick={() => handleCopy('git clone <REPO_URL> && cd vidiload-studio && npm install && npm run build && npm start', 'clone')}
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                  title="Kopyala"
                >
                  {copiedKey === 'clone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5 font-mono text-[11px] text-slate-300">
                <span className="text-cyan-400">docker compose up -d --build</span>
                <button
                  onClick={() => handleCopy('docker compose up -d --build', 'docker')}
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                  title="Kopyala"
                >
                  {copiedKey === 'docker' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5 font-mono text-[11px] text-slate-300">
                <span className="text-amber-400">chmod +x ./setup.sh &amp;&amp; ./setup.sh (Ubuntu/VPS)</span>
                <button
                  onClick={() => handleCopy('chmod +x ./setup.sh && ./setup.sh', 'setup')}
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                  title="Kopyala"
                >
                  {copiedKey === 'setup' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-white/[0.08] bg-[#0e121e] text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Motor Durumu: <strong>Hazır &amp; Aktif</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-bold transition-all"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
