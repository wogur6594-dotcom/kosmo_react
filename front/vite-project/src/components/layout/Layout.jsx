import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout() {
  return (
    <>
      <style>{`
        .layout-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg);
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          animation: pageFadeIn 0.35s ease-out forwards;
        }

        @keyframes pageFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
      
      <div className="layout-wrapper">
        <Header />
        <main className="main-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Layout;
