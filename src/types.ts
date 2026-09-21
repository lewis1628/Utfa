export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'facebook';

export type PageView = 'home' | 'youtube' | 'social' | 'login' | 'register' | 'vps' | 'history';

export interface DownloadOption {
  format: 'mp4' | 'mp3';
  quality: string;
  qualityLabel: string;
  ext: string;
  sizeEstimate: string;
  isAudioOnly?: boolean;
  formatId?: string;
}

export interface VideoMetadata {
  id: string;
  url: string;
  title: string;
  platform: Platform;
  author: string;
  authorUrl?: string;
  duration: number; // in seconds
  durationFormatted: string;
  thumbnail: string;
  views?: number;
  likes?: number;
  availableOptions: DownloadOption[];
}

export interface DownloadHistoryItem {
  id: string;
  videoTitle: string;
  thumbnail: string;
  platform: Platform;
  format: 'mp4' | 'mp3';
  quality: string;
  timestamp: number;
  fileSize?: string;
  downloadUrl?: string;
  originalUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  totalDownloads: number;
}
