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

        /* Variants (Forced High-Contrast Hex Codes to prevent variable dropping) */
        .btn-primary {
          background-color: #783F04 !important; /* 초코 식빵 브라운 */
          color: #ffffff !important;
        }
        .btn-primary:not(:disabled):hover {
          background-color: #542B01 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(120, 63, 4, 0.25);
        }
        .btn-primary:not(:disabled):active {
          transform: translateY(0);
        }

        .btn-secondary {
          background-color: #D97706 !important; /* 골든 허니 오렌지 */
          color: #ffffff !important;
        }
        .btn-secondary:not(:disabled):hover {
          background-color: #B45309 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25);
        }
        .btn-secondary:not(:disabled):active {
          transform: translateY(0);
        }

        .btn-outline {
          background-color: transparent !important;
          border: 2px solid #783F04 !important; /* 굵고 선명한 테두리 */
          color: #783F04 !important;
        }
        .btn-outline:not(:disabled):hover {
          background-color: #F7EFE5 !important;
          transform: translateY(-2px);
        }
        .btn-outline:not(:disabled):active {
          transform: translateY(0);
        }

        .btn-text {
          background-color: transparent !important;
          color: #2D221A !important;
          padding-left: 8px !important;
          padding-right: 8px !important;
          font-weight: 700;
        }
        .btn-text:not(:disabled):hover {
          color: #783F04 !important;
          background-color: #FAF4EB !important;
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
