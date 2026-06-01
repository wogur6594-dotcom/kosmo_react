import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/pages/Home';
import StockDetail from './components/pages/StockDetail';
import Board from './components/pages/Board';
import BoardWrite from './components/pages/BoardWrite';
import BoardDetail from './components/pages/BoardDetail';
import Notice from './components/pages/Notice';
import NoticeDetail from './components/pages/NoticeDetail';
import Auth from './components/pages/Auth';
import Profile from './components/pages/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Shared root layout with header, footer, outlet
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'stock/:symbol',
        element: <StockDetail />
      },
      {
        path: 'board',
        element: <Board />
      },
      {
        path: 'board/write',
        element: <BoardWrite />
      },
      {
        path: 'board/:id',
        element: <BoardDetail />
      },
      {
        path: 'notice',
        element: <Notice />
      },
      {
        path: 'notice/:id',
        element: <NoticeDetail />
      },
      {
        path: 'auth',
        element: <Auth />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
