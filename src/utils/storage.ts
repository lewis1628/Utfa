import { DownloadHistoryItem, Platform, User } from '../types';

const USER_KEY = 'vidiload_current_user';
const HISTORY_KEY = 'vidiload_download_history';

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null): void {
  try {
    if (!user) {
      localStorage.removeItem(USER_KEY);
    } else {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  } catch {
    // ignore
  }
}

export function getDownloadHistory(): DownloadHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addDownloadHistoryItem(item: Omit<DownloadHistoryItem, 'id' | 'timestamp'>): DownloadHistoryItem {
  const history = getDownloadHistory();
  const newItem: DownloadHistoryItem = {
    ...item,
    id: 'dl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: Date.now(),
  };

  const updated = [newItem, ...history.filter(h => h.originalUrl !== item.originalUrl || h.format !== item.format)].slice(0, 50);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  // Update user stats if logged in
  const currentUser = getStoredUser();
  if (currentUser) {
    currentUser.totalDownloads += 1;
    setStoredUser(currentUser);
  }

  return newItem;
}

export function clearDownloadHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // ignore
  }
}

export function detectPlatform(url: string): Platform | null {
  const trimmed = url.trim().toLowerCase();
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    return 'youtube';
  }
  if (trimmed.includes('instagram.com')) {
    return 'instagram';
  }
  if (trimmed.includes('tiktok.com')) {
    return 'tiktok';
  }
  if (trimmed.includes('facebook.com') || trimmed.includes('fb.watch')) {
    return 'facebook';
  }
  return null;
}

export function formatSeconds(sec: number): string {
  if (!sec || isNaN(sec)) return '0:00';
  const mins = Math.floor(sec / 60);
  const remainder = Math.floor(sec % 60);
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}:${m.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  }
  return `${mins}:${remainder.toString().padStart(2, '0')}`;
}

export function formatViewCount(num?: number): string {
  if (!num) return '100K+';
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + ' Mr';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + ' Mn';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + ' B';
  }
  return num.toString();
}
