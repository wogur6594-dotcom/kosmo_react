import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // High fidelity fallback stock data in case backend server is starting/reconnecting
  const defaultStocks = [
    { symbol: '005930', name: '삼성전자', currentPrice: 72800, changePrice: 1200, changeRate: 1.68, category: 'KOSPI' },
    { symbol: 'AAPL', name: '애플', currentPrice: 182.5, changePrice: -2.3, changeRate: -1.24, category: 'NASDAQ' },
    { symbol: 'TSLA', name: '테슬라', currentPrice: 179.8, changePrice: 5.4, changeRate: 3.10, category: 'NASDAQ' },
    { symbol: '000660', name: 'SK하이닉스', currentPrice: 185400, changePrice: 6200, changeRate: 3.46, category: 'KOSPI' },
    { symbol: 'NVDA', name: '엔비디아', currentPrice: 910.2, changePrice: 18.5, changeRate: 2.07, category: 'NASDAQ' }
  ];

  useEffect(() => {
    fetch('http://localhost:8082/api/stock/list')
      .then(res => {
        if (!res.ok) throw new Error('API Reconnecting');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setStocks(data);
        } else {
          setStocks(defaultStocks);
        }
        setLoading(false);
      })
      .catch(() => {
        // Safe mock loading
        setStocks(defaultStocks);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-5 py-8 animate-fade-in">
      
      {/* 1. Market Indices Section (KOSPI & KOSDAQ cards) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        
        {/* KOSPI Card */}
        <div className="p-6 rounded-toss bg-white dark:bg-toss-dark-card border border-toss-gray-200 dark:border-toss-dark-border shadow-toss hover:shadow-toss-hover transition-all">
          <p className="text-sm font-bold text-toss-gray-500">코스피 KOSPI</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <h3 className="text-3xl font-extrabold text-toss-gray-900 dark:text-toss-gray-50">2,654.10</h3>
            <span className="text-sm font-bold text-[var(--stock-up)]">+42.15 (+1.61%)</span>
          </div>
          <p className="text-xs text-toss-gray-400 mt-4">어제보다 상승하여 마감</p>
        </div>

        {/* KOSDAQ Card */}
        <div className="p-6 rounded-toss bg-white dark:bg-toss-dark-card border border-toss-gray-200 dark:border-toss-dark-border shadow-toss hover:shadow-toss-hover transition-all">
          <p className="text-sm font-bold text-toss-gray-500">코스닥 KOSDAQ</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <h3 className="text-3xl font-extrabold text-toss-gray-900 dark:text-toss-gray-50">842.18</h3>
            <span className="text-sm font-bold text-[var(--stock-down)]">-3.12 (-0.37%)</span>
          </div>
          <p className="text-xs text-toss-gray-400 mt-4">어제보다 하락하여 마감</p>
        </div>

      </section>

      {/* 2. Popular Stocks Dashboard */}
      <section className="bg-white dark:bg-toss-dark-card rounded-toss border border-toss-gray-200 dark:border-toss-dark-border p-6 shadow-toss mb-8">
        <h4 className="text-lg font-extrabold text-toss-gray-900 dark:text-toss-gray-50 mb-6">실시간 인기 주식</h4>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-16 shimmer rounded-toss-sm" />)}
          </div>
        ) : (
          <div className="divide-y divide-toss-gray-100 dark:divide-toss-dark-border">
            {stocks.map((stock, index) => {
              const isUp = stock.changeRate >= 0;
              const color = isUp ? 'var(--stock-up)' : 'var(--stock-down)';
              const prefix = isUp ? '+' : '';

              return (
                <Link 
                  to={`/stock/${stock.symbol}`}
                  key={stock.symbol}
                  className="flex items-center justify-between py-4 hover:bg-toss-gray-50 dark:hover:bg-toss-dark-border/40 rounded-toss-sm px-2 -mx-2 transition-colors duration-150"
                >
                  {/* Name and Rank info */}
                  <div className="flex items-center space-x-4">
                    <span className="text-base font-extrabold text-toss-blue w-6 text-center">{index + 1}</span>
                    <div>
                      <p className="text-[15px] font-bold text-toss-gray-900 dark:text-toss-gray-50">{stock.name}</p>
                      <span className="text-xs text-toss-gray-400 font-semibold uppercase">{stock.symbol} · {stock.category}</span>
                    </div>
                  </div>

                  {/* Price and fluctuations */}
                  <div className="text-right">
                    <p className="text-base font-extrabold text-toss-gray-900 dark:text-toss-gray-50">
                      {stock.category === 'NASDAQ' ? `$${stock.currentPrice.toLocaleString()}` : `₩${stock.currentPrice.toLocaleString()}`}
                    </p>
                    <span className="text-xs font-bold" style={{ color: color }}>
                      {prefix}{stock.changePrice.toLocaleString()} ({prefix}{stock.changeRate.toFixed(2)}%)
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Market News Section */}
      <section className="bg-white dark:bg-toss-dark-card rounded-toss border border-toss-gray-200 dark:border-toss-dark-border p-6 shadow-toss">
        <h4 className="text-lg font-extrabold text-toss-gray-900 dark:text-toss-gray-50 mb-6">오늘의 금융 뉴스</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="flex flex-col justify-between">
            <span className="text-xs font-bold text-toss-blue bg-toss-blue-light dark:bg-toss-blue-dark/30 px-2.5 py-1 rounded-full self-start mb-3">종합 마켓</span>
            <h5 className="text-[14px] font-extrabold leading-snug text-toss-gray-800 dark:text-toss-gray-200">
              반도체 대장주 동반 랠리, 코스피 외인 대규모 순매수 속에 마감
            </h5>
            <p className="text-xs text-toss-gray-400 mt-4">토스 뉴스 · 2시간 전</p>
          </div>

          <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-toss-gray-200 dark:border-toss-dark-border pt-4 md:pt-0 md:pl-6">
            <span className="text-xs font-bold text-toss-blue bg-toss-blue-light dark:bg-toss-blue-dark/30 px-2.5 py-1 rounded-full self-start mb-3">미국 증시</span>
            <h5 className="text-[14px] font-extrabold leading-snug text-toss-gray-800 dark:text-toss-gray-200">
              테슬라, 신형 자율주행(FSD) 릴리즈 소식에 투자 심리 강하게 급등
            </h5>
            <p className="text-xs text-toss-gray-400 mt-4">마켓 레이더 · 4시간 전</p>
          </div>

          <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-toss-gray-200 dark:border-toss-dark-border pt-4 md:pt-0 md:pl-6">
            <span className="text-xs font-bold text-toss-blue bg-toss-blue-light dark:bg-toss-blue-dark/30 px-2.5 py-1 rounded-full self-start mb-3">주요 금리</span>
            <h5 className="text-[14px] font-extrabold leading-snug text-toss-gray-800 dark:text-toss-gray-200">
              미 연준 연례 미팅 개최 임박, 이번 가을 금리 인하 경로 구체화 기대감
            </h5>
            <p className="text-xs text-toss-gray-400 mt-4">글로벌 이코노미 · 6시간 전</p>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;
