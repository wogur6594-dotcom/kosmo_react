import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Sync authentication state from localStorage
  useEffect(() => {
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');
    if (username && name) {
      setUser({ username, name });
    } else {
      setUser(null);
    }
  }, [location.pathname]); // Update when changing pages

  // Sync dark mode configuration
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/');
  };

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-toss-dark-bg/80 border-b border-toss-gray-200 dark:border-toss-dark-border transition-colors duration-250">
      <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
        
        {/* Toss-like Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-extrabold text-toss-blue tracking-tight select-none">
          <span>toss</span>
          <span className="text-toss-gray-900 dark:text-toss-gray-50 font-semibold text-lg">주식</span>
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8 text-[15px] font-semibold text-toss-gray-600 dark:text-toss-gray-300">
          <Link to="/" className={`hover:text-toss-blue transition-colors ${location.pathname === '/' ? 'text-toss-blue' : ''}`}>홈</Link>
          <Link to="/board" className={`hover:text-toss-blue transition-colors ${location.pathname.startsWith('/board') ? 'text-toss-blue' : ''}`}>토론방</Link>
          <Link to="/notice" className={`hover:text-toss-blue transition-colors ${location.pathname.startsWith('/notice') ? 'text-toss-blue' : ''}`}>공지사항</Link>
          {user && (
            <Link to="/profile" className={`hover:text-toss-blue transition-colors ${location.pathname === '/profile' ? 'text-toss-blue' : ''}`}>포트폴리오</Link>
          )}
        </nav>

        {/* Utility / Auth Actions */}
        <div className="flex items-center space-x-4">
          
          {/* Dark Mode Toggle Switch */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-toss-gray-100 dark:hover:bg-toss-dark-card text-toss-gray-500 dark:text-toss-gray-400 transition-colors"
            title="테마 변경"
          >
            {darkMode ? (
              // Sun icon for dark mode (click to switch to light)
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37c-.39-.39-.39-1.03 0-1.41s1.03-.39 1.41 0l1.06 1.06c.39.39.39 1.03 0 1.41s-1.03.39-1.41 0l-1.06-1.06zM7.05 18.01c-.39-.39-.39-1.03 0-1.41s1.03-.39 1.41 0l1.06 1.06c.39.39.39 1.03 0 1.41s-1.03.39-1.41 0l-1.06-1.06z"/>
              </svg>
            ) : (
              // Moon icon for light mode (click to switch to dark)
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.3 2a10 10 0 0 0-1.9 19.5 10 10 0 0 0 11.5-12.2 7.5 7.5 0 0 1-9.6-9.6c.3-.6.1-1.3-.5-1.5z"/>
              </svg>
            )}
          </button>

          {/* User Account / Login State */}
          {user ? (
            <div className="flex items-center space-x-3 text-sm">
              <span className="hidden sm:inline font-semibold text-toss-gray-800 dark:text-toss-gray-200">{user.name}님</span>
              <button 
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-toss-sm bg-toss-gray-100 hover:bg-toss-gray-200 dark:bg-toss-dark-card dark:hover:bg-toss-dark-border text-toss-gray-700 dark:text-toss-gray-300 font-bold transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link 
              to="/auth"
              className="px-4 py-1.5 rounded-toss-sm bg-toss-blue hover:bg-toss-blue-hover text-white font-bold text-sm transition-colors shadow-toss hover:shadow-toss-hover"
            >
              로그인
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}

export default Header;
