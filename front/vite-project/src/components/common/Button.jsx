import React from 'react';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false, 
  ...props 
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return 'btn-secondary';
      case 'outline':
        return 'btn-outline';
      case 'text':
        return 'btn-text';
      case 'primary':
      default:
        return 'btn-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'btn-sm';
      case 'lg':
        return 'btn-lg';
      case 'md':
      default:
        return 'btn-md';
    }
  };

  return (
    <>
      <style>{`
        .btn-base {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-sans);
          font-weight: 600;
          border-radius: var(--border-radius-sm);
          border: 1px solid transparent;
          cursor: pointer;
          transition: var(--transition);
          outline: none;
          white-space: nowrap;
          text-decoration: none;
        }

        .btn-base:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none !important;
          transform: none !important;
        }

        /* Sizes */
        .btn-sm {
          padding: 8px 16px;
          font-size: 0.85rem;
          border-radius: 8px;
        }
        .btn-md {
          padding: 12px 24px;
          font-size: 0.95rem;
          border-radius: 10px;
        }
        .btn-lg {
          padding: 16px 32px;
          font-size: 1.05rem;
          border-radius: 12px;
        }

        /* Variants (Forced High-Contrast Hex Codes or Variables to prevent variable dropping) */
        .btn-primary {
          background-color: var(--toss-blue) !important; /* 토스 블루 */
          color: #ffffff !important;
        }
        .btn-primary:not(:disabled):hover {
          background-color: var(--toss-blue-hover) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(49, 130, 246, 0.25);
        }
        .btn-primary:not(:disabled):active {
          transform: translateY(0);
        }

        .btn-secondary {
          background-color: var(--toss-blue-light) !important; /* 토스 연블루 */
          color: var(--toss-blue) !important;
        }
        .btn-secondary:not(:disabled):hover {
          background-color: #D2E3FC !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(49, 130, 246, 0.15);
        }
        .btn-secondary:not(:disabled):active {
          transform: translateY(0);
        }

        .btn-outline {
          background-color: transparent !important;
          border: 2px solid var(--toss-blue) !important; /* 굵고 선명한 테두리 */
          color: var(--toss-blue) !important;
        }
        .btn-outline:not(:disabled):hover {
          background-color: var(--toss-blue-light) !important;
          transform: translateY(-2px);
        }
        .btn-outline:not(:disabled):active {
          transform: translateY(0);
        }

        .btn-text {
          background-color: transparent !important;
          color: var(--text-primary) !important;
          padding-left: 8px !important;
          padding-right: 8px !important;
          font-weight: 700;
        }
        .btn-text:not(:disabled):hover {
          color: var(--toss-blue) !important;
          background-color: var(--toss-blue-light) !important;
        }
      `}</style>
      <button
        className={`btn-base ${getVariantClass()} ${getSizeClass()} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    </>
  );
}

export default Button;
