import React from 'react';

function Card({ 
  children, 
  hoverable = true, 
  className = '', 
  onClick, 
  ...props 
}) {
  return (
    <>
      <style>{`
        .card-base {
          background-color: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--border-radius);
          padding: 24px;
          transition: var(--transition);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow);
        }

        .card-hoverable {
          cursor: ${onClick ? 'pointer' : 'default'};
        }

        .card-hoverable:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-hover);
          border-color: var(--secondary);
        }
      `}</style>
      <div
        className={`card-base ${hoverable ? 'card-hoverable' : ''} ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export default Card;
