import React, { useState, useEffect } from 'react';
import { PageView, User } from './types';
import { getStoredUser, setStoredUser, getDownloadHistory } from './utils/storage';
import { Navbar } from './components/Navbar';
import { ElectricSidebar } from './components/ElectricSidebar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { YouTubePage } from './pages/YouTubePage';
import { SocialMediaPage } from './pages/SocialMediaPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VpsGuidePage } from './pages/VpsGuidePage';
import { HistoryPage } from './pages/HistoryPage';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [passedUrl, setPassedUrl] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    // Load stored user and history
    const user = getStoredUser();
    if (user) {
      setCurrentUser(user);
    }
    const hist = getDownloadHistory();
    setHistoryCount(hist.length);
  }, []);

  const handleNavigate = (page: PageView, initialUrl?: string) => {
    if (initialUrl !== undefined) {
      setPassedUrl(initialUrl);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Always close sidebar upon navigation
    setIsSidebarOpen(false);

    // Refresh history counter
    const hist = getDownloadHistory();
    setHistoryCount(hist.length);
  };

  const handleLogout = () => {
    setStoredUser(null);
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* Top Navbar with Right-Side Electric Menu Button */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        historyCount={historyCount}
        onOpenSidebar={() => setIsSidebarOpen(true)}
      />

      {/* Electric Slide-over Sidebar on the Right (Reels Style ⚡) */}
      <ElectricSidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
        historyCount={historyCount}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Full-width Centered Main Content (Perfect on mobile & desktop, no clipping) */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {currentPage === 'home' && (
              <HomePage onNavigate={handleNavigate} />
            )}

            {currentPage === 'youtube' && (
              <YouTubePage
                initialUrl={passedUrl}
                onNavigateHistory={() => handleNavigate('history')}
              />
            )}

            {currentPage === 'social' && (
              <SocialMediaPage initialUrl={passedUrl} />
            )}

            {currentPage === 'login' && (
              <LoginPage
                onNavigate={handleNavigate}
                onLoginSuccess={handleLoginSuccess}
              />
            )}

            {currentPage === 'register' && (
              <RegisterPage
                onNavigate={handleNavigate}
                onRegisterSuccess={handleLoginSuccess}
              />
            )}

            {currentPage === 'vps' && (
              <VpsGuidePage />
            )}

            {currentPage === 'history' && (
              <HistoryPage
                onNavigate={handleNavigate}
                currentUser={currentUser}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
