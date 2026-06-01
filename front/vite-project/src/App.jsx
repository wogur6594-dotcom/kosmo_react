import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import ProductIntro from './components/pages/ProductIntro';
import ProductList from './components/pages/ProductList';
import Notice from './components/pages/Notice';
import NoticeWrite from './components/pages/NoticeWrite';
import Qna from './components/pages/Qna';
import Auth from './components/pages/Auth';

// Create a modern route object mapping for react-router-dom v6
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Root layout wrap with <Outlet />
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'intro',
        element: <ProductIntro />
      },
      {
        path: 'products',
        element: <ProductList />
      },
      {
        path: 'notice',
        element: <Notice />
      },
      {
        path: 'notice/write',
        element: <NoticeWrite />
      },
      {
        path: 'qna',
        element: <Qna />
      },
      {
        path: 'auth',
        element: <Auth />
      }
    ]
  }
]);

function App() {
  // Render routing using the modern RouterProvider
  return <RouterProvider router={router} />;
}

export default App;
