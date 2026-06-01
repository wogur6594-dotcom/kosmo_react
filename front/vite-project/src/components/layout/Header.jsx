import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Flame } from 'lucide-react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Scroll detection for glassy styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link-active' : '';
  };

  return (
    <>
      <style>{`
        .header-outer {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: var(--transition);
          background-color: ${isScrolled ? 'rgba(252, 250, 247, 0.85)' : 'var(--bg)'};
          backdrop-filter: ${isScrolled ? 'blur(12px)' : 'none'};
          border-bottom: 1px solid ${isScrolled ? 'var(--border)' : 'transparent'};
          box-shadow: ${isScrolled ? '0 4px 20px rgba(139, 90, 43, 0.04)' : 'none'};
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
          padding: 0 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Logo styling */
        .logo-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: 1.45rem;
          color: var(--text-heading);
          letter-spacing: -0.5px;
        }

        .logo-icon {
          color: var(--accent);
          animation: logoPulse 2s infinite ease-in-out;
        }

        @keyframes logoPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08) rotate(5deg); }
        }

        /* Desktop GNB */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        @media (max-width: 768px) {
          .desktop-nav { display: none; }
        }

        .nav-link {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-light);
          padding: 8px 4px;
          position: relative;
        }

        .nav-link:hover {
          color: var(--primary);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--primary);
          transition: var(--transition);
        }

        .nav-link:hover::after, .nav-link-active::after {
          width: 100%;
        }

        .nav-link-active {
          color: var(--primary) !important;
        }

        /* Utility Menu (Cart / Account) */
        .util-menu {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .util-btn {
          background: none;
          border: none;
          color: var(--text);
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .util-btn:hover {
          background-color: var(--primary-light);
          color: var(--primary);
        }

        .cart-badge {
          position: absolute;
          top: 0;
          right: 0;
          background-color: var(--accent);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--bg);
        }

        /* Mobile Hamburger */
        .mobile-toggle {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-toggle { display: flex; }
          .util-btn.account-btn { display: none; }
        }

        /* Mobile Side Navigation Drawer */
        .mobile-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(45, 31, 23, 0.4);
          backdrop-filter: blur(4px);
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: var(--transition);
        }

        .mobile-nav-overlay-active {
          opacity: 1;
          visibility: visible;
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          right: -300px;
          bottom: 0;
          width: 280px;
          background-color: var(--card-bg);
          box-shadow: -10px 0 30px rgba(139, 90, 43, 0.1);
          z-index: 1000;
          transition: var(--transition);
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .mobile-drawer-active {
          right: 0;
        }

        .mobile-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
          padding-bottom: 20px;
        }

        .mobile-drawer-links {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .mobile-nav-link {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-heading);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(239, 231, 222, 0.5);
        }

        .mobile-nav-link-active {
          color: var(--primary);
        }
      `}</style>

      <header className="header-outer">
        <div className="header-container">
          {/* Logo */}
          <Link to="/" className="logo-link">
            <Flame className="logo-icon" size={26} fill="currentColor" />
            <span>Bready & Co.</span>
          </Link>

          {/* Desktop GNB */}
          <nav className="desktop-nav">
            <Link to="/intro" className={`nav-link ${isActive('/intro')}`}>브랜드 스토리</Link>
            <Link to="/products" className={`nav-link ${isActive('/products')}`}>식빵 메뉴</Link>
            <Link to="/notice" className={`nav-link ${isActive('/notice')}`}>소식 & 이벤트</Link>
            <Link to="/qna" className={`nav-link ${isActive('/qna')}`}>Q&A 게시판</Link>
          </nav>

          {/* Utility Menu */}
          <div className="util-menu">
            <Link to="/products" className="util-btn" aria-label="Cart">
              <ShoppingBag size={20} />
              <span className="cart-badge">2</span>
            </Link>
            <Link to="/auth" className="util-btn account-btn" aria-label="Account">
              <User size={20} />
            </Link>
            <button 
              className="util-btn mobile-toggle" 
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`mobile-nav-overlay ${isMenuOpen ? 'mobile-nav-overlay-active' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Side Drawer */}
      <div className={`mobile-drawer ${isMenuOpen ? 'mobile-drawer-active' : ''}`}>
        <div className="mobile-drawer-header">
          <Link to="/" className="logo-link" onClick={() => setIsMenuOpen(false)}>
            <Flame className="logo-icon" size={22} fill="currentColor" />
            <span style={{ fontSize: '1.25rem' }}>Bready & Co.</span>
          </Link>
          <button className="util-btn" onClick={() => setIsMenuOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <nav className="mobile-drawer-links">
          <Link to="/intro" className={`mobile-nav-link ${isActive('/intro')}`} onClick={() => setIsMenuOpen(false)}>
            브랜드 스토리
          </Link>
          <Link to="/products" className={`mobile-nav-link ${isActive('/products')}`} onClick={() => setIsMenuOpen(false)}>
            식빵 메뉴
          </Link>
          <Link to="/notice" className={`mobile-nav-link ${isActive('/notice')}`} onClick={() => setIsMenuOpen(false)}>
            소식 & 이벤트
          </Link>
          <Link to="/qna" className={`mobile-nav-link ${isActive('/qna')}`} onClick={() => setIsMenuOpen(false)}>
            Q&A 게시판
          </Link>
          <Link to="/auth" className={`mobile-nav-link ${isActive('/auth')}`} onClick={() => setIsMenuOpen(false)}>
            로그인 / 회원가입
          </Link>
        </nav>
      </div>
    </>
  );
}

export default Header;
