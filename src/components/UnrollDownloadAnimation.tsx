import React, { useState, useEffect, useRef } from 'react';
import { Download, Check, Sparkles, Zap, ArrowDown, FileVideo, Music2, RefreshCw } from 'lucide-react';

interface UnrollDownloadAnimationProps {
  isDownloading: boolean;
  progress: number; // 0 to 100
  title?: string;
  fileType?: 'video' | 'audio' | 'file';
  quality?: string;
  size?: string;
  onComplete?: () => void;
  soundEnabled?: boolean;
}

export const UnrollDownloadAnimation: React.FC<UnrollDownloadAnimationProps> = ({
  isDownloading,
  progress,
  title = 'İndirilen Medya',
  fileType = 'video',
  quality = '1080p',
  size = '34 MB',
  onComplete,
  soundEnabled = true,
}) => {
  // Animation states: 'idle' | 'unrolling' | 'loading' | 'snapping' | 'launched' | 'completed'
  const [animState, setAnimState] = useState<'idle' | 'unrolling' | 'loading' | 'snapping' | 'launched' | 'completed'>('idle');
  const [sag, setSag] = useState<number>(0);
  const [fileLaunched, setFileLaunched] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Sound generator using Web Audio API (Zero dependencies!)
  const playSound = (type: 'unroll' | 'progress' | 'snap' | 'launch' | 'chime') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (type === 'unroll') {
        // Zip / unrolling whoosh sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.5);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'snap') {
        // Elastic rope snap sound (twang)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'launch') {
        // Sky launch / slingshot whoosh 🪂
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.4);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'chime') {
        // Success celebration bell
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);

          gain.gain.setValueAtTime(0.06, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.4);
        });
      }
    } catch {
      // Audio might be blocked before first user gesture
    }
  };

  // Watch isDownloading & progress to orchestrate the exact animation sequence:
  // "The ring doesn't disappear when you press it — it unrolls into its own progress bar.
  // Same stroke, same length: 2πr. Then the rope snaps straight and throws the file into the sky. 🪂"
  useEffect(() => {
    if (!isDownloading) {
      setAnimState('idle');
      setFileLaunched(false);
      setSag(0);
      return;
    }

    // Step 1: Unroll ring into straight progress track
    setAnimState('unrolling');
    playSound('unroll');

    const unrollTimer = setTimeout(() => {
      setAnimState('loading');
    }, 450);

    return () => clearTimeout(unrollTimer);
  }, [isDownloading]);

  // Adjust sag based on progress (slight elastic dip in the rope as file moves)
  useEffect(() => {
    if (animState === 'loading') {
      // Curve dips down slightly when progress is in the middle (0 to 12px)
      const dip = Math.sin((progress / 100) * Math.PI) * 14;
      setSag(dip);

      // When progress hits 100%:
      if (progress >= 100) {
        // Trigger Slingshot Snap & Sky Launch!
        setAnimState('snapping');
        playSound('snap');

        // Snap oscillation
        setTimeout(() => {
          setSag(-10); // rope snaps upwards!
          setAnimState('launched');
          setFileLaunched(true);
          playSound('launch');
        }, 120);

        setTimeout(() => {
          setSag(0); // rope settles back straight
        }, 280);

        setTimeout(() => {
          setAnimState('completed');
          playSound('chime');
          if (onComplete) onComplete();
        }, 900);
      }
    }
  }, [progress, animState]);

  // SVG Geometry Constants
  // Radius of initial ring: r = 26px -> Circumference 2πr ≈ 163.36px
  const radius = 26;
  const circumference = 2 * Math.PI * radius; // 163.36px
  const trackWidth = 240; // Horizontal length for progress bar track
  const svgHeight = 110;
  const baseY = 58;

  // Calculate file capsule X position along the rope (from left padding 20 to 20 + trackWidth)
  const fileX = 20 + (trackWidth * (Math.min(progress, 100) / 100));
  // Y position follows the rope sag
  const fileY = baseY + Math.sin((Math.min(progress, 100) / 100) * Math.PI) * sag;

  return (
    <div 
      className="w-full rounded-2xl bg-[#0b0f19] border border-cyan-500/30 p-4 sm:p-5 shadow-[0_0_30px_rgba(0,240,255,0.15)] relative overflow-hidden select-none"
      id="unroll-download-container"
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/10 blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300 font-bold">2πr Unroll Engine ⚡</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 truncate max-w-[160px] sm:max-w-[240px]">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-black border border-cyan-500/30">
            {quality}
          </span>
          <span className="text-slate-400 font-bold">{progress}%</span>
        </div>
      </div>

      {/* SVG Canvas for the "Ring Unrolls into Progress Bar + Slingshot" Animation */}
      <div className="relative w-full flex items-center justify-center h-28 sm:h-32">
        <svg
          viewBox={`0 0 280 ${svgHeight}`}
          className="w-full max-w-sm h-full overflow-visible"
        >
          <defs>
            {/* Electric glowing neon gradient */}
            <linearGradient id="electricRopeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. INITIAL RING (when animState is 'idle') */}
          {animState === 'idle' && (
            <g className="cursor-pointer">
              {/* Outer guide ring */}
              <circle
                cx="140"
                cy={baseY}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="3.5"
              />
              {/* Electric active ring (circumference = 2πr) */}
              <circle
                cx="140"
                cy={baseY}
                r={radius}
                fill="#0d1424"
                stroke="url(#electricRopeGrad)"
                strokeWidth="3.5"
                filter="url(#neonGlow)"
                className="animate-pulse"
              />
              {/* Centered Download Arrow Icon */}
              <g transform={`translate(${140 - 10}, ${baseY - 10})`}>
                <path
                  d="M10 3v10M6 9l4 4 4-4M3 17h14"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          )}

          {/* 2. UNROLLING / LOADING / SNAPPING / LAUNCHED STATES */}
          {animState !== 'idle' && (
            <g>
              {/* Background guide track (dim gray) */}
              <path
                d={`M 20 ${baseY} Q 140 ${baseY + sag} 260 ${baseY}`}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Dynamic Electric Rope / Progress Bar (Length = 2πr, fills with progress) */}
              <path
                d={`M 20 ${baseY} Q 140 ${baseY + sag} 260 ${baseY}`}
                fill="none"
                stroke="url(#electricRopeGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#neonGlow)"
                strokeDasharray={trackWidth}
                strokeDashoffset={trackWidth - (trackWidth * (Math.min(progress, 100) / 100))}
                className="transition-all duration-150 ease-out"
              />

              {/* Rope End Anchors (Pillars) */}
              <circle cx="20" cy={baseY} r="4" fill="#00f0ff" filter="url(#neonGlow)" />
              <circle cx="260" cy={baseY} r="4" fill="#a855f7" filter="url(#neonGlow)" />

              {/* 3. THE FILE PACKET SITTING ON THE ROPE */}
              {!fileLaunched && (
                <g 
                  transform={`translate(${fileX - 16}, ${fileY - 26})`}
                  className="transition-all duration-150"
                >
                  {/* File card container */}
                  <rect
                    width="32"
                    height="24"
                    rx="6"
                    fill="#0e172a"
                    stroke="#00f0ff"
                    strokeWidth="1.5"
                    filter="url(#neonGlow)"
                  />
                  {/* File icon content */}
                  <g transform="translate(8, 4)">
                    {fileType === 'audio' ? (
                      <path
                        d="M4 12V4l8-2v8M4 9a2 2 0 100 4 2 2 0 000-4zM12 7a2 2 0 100 4 2 2 0 000-4z"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                      />
                    ) : (
                      <path
                        d="M2 3h8l4 4v7a2 2 0 01-2 2H2a2 2 0 01-2-2V5a2 2 0 012-2z"
                        fill="none"
                        stroke="#00f0ff"
                        strokeWidth="1.5"
                      />
                    )}
                  </g>
                  {/* Miniature connection rope clasp */}
                  <line x1="16" y1="24" x2="16" y2="27" stroke="#00f0ff" strokeWidth="2" />
                </g>
              )}

              {/* 4. THE FILE THROWN INTO THE SKY! 🪂 (Snaps straight and launches upward) */}
              {fileLaunched && (
                <g 
                  className="animate-file-launch"
                  transform="translate(240, -10)"
                >
                  {/* Parachute or Rocket Trail */}
                  <g transform="translate(-18, -25)">
                    <path
                      d="M 6 12 C 6 2, 30 2, 30 12 Z"
                      fill="rgba(0, 240, 255, 0.25)"
                      stroke="#00f0ff"
                      strokeWidth="1.5"
                    />
                    <line x1="6" y1="12" x2="18" y2="24" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    <line x1="18" y1="12" x2="18" y2="24" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    <line x1="30" y1="12" x2="18" y2="24" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                  </g>

                  {/* Launched File Card */}
                  <rect
                    x="2"
                    y="0"
                    width="32"
                    height="24"
                    rx="6"
                    fill="#101a30"
                    stroke="#a855f7"
                    strokeWidth="2"
                    filter="url(#neonGlow)"
                  />
                  <g transform="translate(10, 4)">
                    <path
                      d="M2 3h8l4 4v7a2 2 0 01-2 2H2a2 2 0 01-2-2V5a2 2 0 012-2z"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="1.5"
                    />
                  </g>
                </g>
              )}
            </g>
          )}
        </svg>

        {/* Celebratory Particles upon completion */}
        {animState === 'completed' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-1 animate-bounce">
              <span className="text-3xl">🪂</span>
              <div className="text-xs font-mono font-bold text-cyan-300">
                GÖKYÜZÜNE FIRLATILDI! ✨
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Status Message & Physics Tagline */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] text-[11px] font-mono">
        <div className="text-slate-400 flex items-center gap-1.5">
          {animState === 'idle' && <span>⚡ İndirmeye Hazır</span>}
          {animState === 'unrolling' && <span className="text-cyan-300 animate-pulse">Halka düz çizgiye açılıyor (2πr)...</span>}
          {animState === 'loading' && <span className="text-cyan-400">İp üzerinde dosya taşınıyor ({progress}%)...</span>}
          {animState === 'snapping' && <span className="text-amber-400 font-bold">İp gerildi, fırlatılıyor! ⚡</span>}
          {animState === 'launched' && <span className="text-purple-400 font-bold">Dosya gökyüzüne fırlatıldı! 🪂</span>}
          {animState === 'completed' && <span className="text-emerald-400 font-bold">İndirme Başlatıldı! 🎉</span>}
        </div>

        <div className="text-[10px] text-slate-500 font-mono hidden sm:inline-block">
          Stroke = 2πr • Zero Dependencies
        </div>
      </div>
    </div>
  );
};
