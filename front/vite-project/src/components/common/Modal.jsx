import React, { useEffect } from 'react';

function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = '' 
}) {
  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'modal-sm';
      case 'lg': return 'modal-lg';
      case 'md':
      default:
        return 'modal-md';
    }
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(20, 11, 6, 0.82) !important; /* 딤드 어둡기 상향 */
          backdrop-filter: blur(16px) !important;              /* 블러 강도 대폭 상향 */
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: modalFadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          padding: 16px;
        }

        .modal-wrapper {
          background-color: #ffffff !important; /* 투명도 원천 해결을 위한 단색 지정 */
          border: 2px solid var(--border) !important;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-hover);
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          animation: modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @media (prefers-color-scheme: dark) {
          .modal-wrapper {
            background-color: #1F1713 !important; /* 다크모드 시 불투명 단색 */
          }
        }

        /* Modal Sizes */
        .modal-sm { max-width: 440px; }
        .modal-md { max-width: 680px; }
        .modal-lg { max-width: 960px; }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 2px solid var(--border) !important;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #FAF4EB !important; /* 불투명 웜 베이지 헤더 배경 */
        }

        @media (prefers-color-scheme: dark) {
          .modal-header {
            background-color: #2E1D13 !important;
          }
        }

        .modal-title-text {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-heading);
        }

        .modal-close-icon-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-light);
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }

        .modal-close-icon-btn:hover {
          color: var(--primary);
          background-color: var(--border);
        }

        .modal-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSlideUp {
          from { 
            opacity: 0; 
            transform: translateY(24px) scale(0.97); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
      `}</style>
      
      <div className="modal-overlay" onClick={onClose}>
        <div 
          className={`modal-wrapper ${getSizeClass()} ${className}`} 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3 className="modal-title-text">{title}</h3>
            <button className="modal-close-icon-btn" onClick={onClose} aria-label="Close modal">
              &times;
            </button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
