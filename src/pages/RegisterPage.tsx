import React, { useState } from 'react';
import { PageView, User } from '../types';
import { setStoredUser } from '../utils/storage';
import { UserPlus, Mail, Lock, User as UserIcon, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (page: PageView) => void;
  onRegisterSuccess: (user: User) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (!email.includes('@')) {
      setError('Lütfen geçerli bir e-posta adresi yazın.');
      return;
    }

    if (password.length < 6) {
      setError('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler birbiriyle eşleşmiyor.');
      return;
    }

    if (!acceptTerms) {
      setError('Devam etmek için kullanım şartlarını kabul etmelisiniz.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      const newUser: User = {
        id: 'user_' + Date.now(),
        name: name.trim(),
        email: email.trim(),
        createdAt: new Date().toLocaleDateString('tr-TR'),
        totalDownloads: 0,
      };

      setStoredUser(newUser);
      onRegisterSuccess(newUser);
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/25">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="font-display font-black text-2xl text-white">Ücretsiz Hesap Oluşturun</h1>
          <p className="text-xs text-slate-400">
            Sınırsız indirme ve dönüştürme geçmişinizi saklamak için kaydolun.
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
            <label className="text-xs font-semibold text-slate-300">Ad Soyad</label>
            <div className="relative flex items-center bg-[#141824] rounded-xl border border-white/10 focus-within:border-rose-500 px-3.5 py-2.5 transition-colors">
              <UserIcon className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız ve Soyadınız"
                className="w-full bg-transparent text-white text-xs focus:outline-none placeholder-slate-500"
                id="register-name-input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">E-Posta Adresi</label>
            <div className="relative flex items-center bg-[#141824] rounded-xl border border-white/10 focus-within:border-rose-500 px-3.5 py-2.5 transition-colors">
              <Mail className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@domain.com"
                className="w-full bg-transparent text-white text-xs focus:outline-none placeholder-slate-500"
                id="register-email-input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Şifre</label>
            <div className="relative flex items-center bg-[#141824] rounded-xl border border-white/10 focus-within:border-rose-500 px-3.5 py-2.5 transition-colors">
              <Lock className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                className="w-full bg-transparent text-white text-xs focus:outline-none placeholder-slate-500"
                id="register-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength meter */}
            {password && (
              <div className="space-y-1 pt-1">
                <div className="flex gap-1 h-1.5">
                  <div className={`flex-1 rounded-full ${strength >= 1 ? 'bg-rose-500' : 'bg-white/10'}`} />
                  <div className={`flex-1 rounded-full ${strength >= 2 ? 'bg-amber-500' : 'bg-white/10'}`} />
                  <div className={`flex-1 rounded-full ${strength >= 3 ? 'bg-emerald-500' : 'bg-white/10'}`} />
                  <div className={`flex-1 rounded-full ${strength >= 4 ? 'bg-emerald-400' : 'bg-white/10'}`} />
                </div>
                <div className="text-[10px] text-slate-400 text-right font-mono">
                  {strength <= 1 && 'Zayıf'}
                  {strength === 2 && 'Orta Seviye'}
                  {strength >= 3 && 'Güçlü ve Güvenli'}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Şifre Tekrarı</label>
            <div className="relative flex items-center bg-[#141824] rounded-xl border border-white/10 focus-within:border-rose-500 px-3.5 py-2.5 transition-colors">
              <Lock className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifrenizi tekrar girin"
                className="w-full bg-transparent text-white text-xs focus:outline-none placeholder-slate-500"
                id="register-confirm-password-input"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 rounded border-white/10 text-rose-600 focus:ring-rose-500 bg-[#141824]"
              />
              <span>
                Kullanım şartlarını ve telif hakları politikalarını kabul ediyorum.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="register-submit-btn"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-display font-bold text-xs shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur ve Başla'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          <span>Zaten hesabınız var mı? </span>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-rose-400 font-bold hover:underline"
            id="register-to-login-link"
          >
            Giriş Yapın
          </button>
        </div>

      </div>
    </div>
  );
};
