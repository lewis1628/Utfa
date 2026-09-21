import React, { useState } from 'react';
import { PageView, User } from '../types';
import { setStoredUser } from '../utils/storage';
import { LogIn, UserPlus, Lock, Mail, Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: PageView) => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    if (!email.includes('@')) {
      setError('Lütfen geçerli bir e-posta adresi yazın.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      const user: User = {
        id: 'user_' + Date.now(),
        name: email.split('@')[0],
        email: email,
        createdAt: new Date().toLocaleDateString('tr-TR'),
        totalDownloads: 0,
      };

      setStoredUser(user);
      onLoginSuccess(user);
      setLoading(false);
      onNavigate('youtube');
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-16 px-4">
      <div className="bg-[#0f121d] border border-white/[0.09] rounded-3xl p-6 sm:p-9 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Subtle Top Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-rose-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="font-display font-black text-2xl text-white">Hesabınıza Giriş Yapın</h1>
          <p className="text-xs text-slate-400">
            Dönüştürme geçmişinize ve özel indirme hızlarına erişin.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">E-Posta Adresi</label>
            <div className="relative flex items-center bg-[#141824] rounded-xl border border-white/10 focus-within:border-rose-500 px-3.5 py-2.5 transition-colors">
              <Mail className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@alanadi.com"
                className="w-full bg-transparent text-white text-xs focus:outline-none placeholder-slate-500"
                id="login-email-input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Şifre</label>
            </div>
            <div className="relative flex items-center bg-[#141824] rounded-xl border border-white/10 focus-within:border-rose-500 px-3.5 py-2.5 transition-colors">
              <Lock className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-white text-xs focus:outline-none placeholder-slate-500"
                id="login-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/10 text-rose-600 focus:ring-rose-500 bg-[#141824]"
              />
              <span>Beni Hatırla</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="login-submit-btn"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-display font-bold text-xs shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          <span>Henüz hesabınız yok mu? </span>
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="text-rose-400 font-bold hover:underline"
            id="login-to-register-link"
          >
            Hemen Kayıt Olun
          </button>
        </div>

      </div>
    </div>
  );
};
