import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import StockChart from '../stock/StockChart';
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw, BarChart2, DollarSign, BookOpen } from 'lucide-react';

function StockDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chart');
  const [stockInfo, setStockInfo] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isUp, setIsUp] = useState(true);

  // Generate Mock Stock Details Based on Symbol
  useEffect(() => {
    const symbolUpper = symbol ? symbol.toUpperCase() : 'AAPL';
    
    // Core stock meta definitions
    const stockMetas = {
      AAPL: { name: '애플', price: 242500, change: 4800, percent: 2.02, isUp: true, cap: '3.1조 달러', vol: '5,245만 주' },
      TSLA: { name: '테슬라', price: 345000, change: -12500, percent: -3.50, isUp: false, cap: '8,420억 달러', vol: '8,920만 주' },
      NVDA: { name: '엔비디아', price: 168000, change: 8400, percent: 5.26, isUp: true, cap: '2.8조 달러', vol: '1.2억 주' },
      MSFT: { name: '마이크로소프트', price: 585000, change: 1200, percent: 0.21, isUp: true, cap: '3.3조 달러', vol: '2,130만 주' },
      '005930': { name: '삼성전자', price: 74200, change: 1100, percent: 1.50, isUp: true, cap: '442조 원', vol: '1,840만 주' },
      '000660': { name: 'SK하이닉스', price: 198500, change: -3500, percent: -1.73, isUp: false, cap: '144조 원', vol: '420만 주' }
    };

    const defaultMeta = {
      name: symbolUpper,
      price: 150000,
      change: 2500,
      percent: 1.69,
      isUp: true,
      cap: '1.5조 원',
      vol: '1,200만 주'
    };

    const meta = stockMetas[symbolUpper] || defaultMeta;
    setStockInfo(meta);
    setIsUp(meta.isUp);

    // Generate mock price history (30 days)
    const basePrice = meta.price;
    const history = [];
    const now = Date.now();
    let currentPrice = basePrice - (meta.change * 15); // Start lower to show path

    for (let i = 0; i < 30; i++) {
      const randomShift = (Math.random() - 0.46) * (basePrice * 0.02); // slight positive bias
      currentPrice += randomShift;
      history.push({
        timestamp: now - (30 - i) * 24 * 60 * 60 * 1000,
        price: Math.round(currentPrice)
      });
    }
    // Make sure the last item matches exactly the current mock price
    history[history.length - 1].price = basePrice;
    setChartData(history);
  }, [symbol]);

  if (!stockInfo) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>주식 정보를 불러오고 있습니다...</h3>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .detail-top-nav-bar {
          background-color: var(--card-bg);
          border-bottom: 1px solid var(--border);
          padding: 16px 0;
          text-align: left;
        }

        .stock-detail-layout {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 32px;
          margin: 40px auto 100px;
          max-width: 1200px;
          text-align: left;
        }

        @media (max-width: 992px) {
          .stock-detail-layout {
            grid-template-columns: 1fr;
            gap: 24px;
            margin-top: 20px;
          }
        }

        /* Stock Info Panel */
        .stock-header-card {
          padding: 32px !important;
          border-radius: var(--border-radius) !important;
          margin-bottom: 24px;
        }

        .stock-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .stock-badge-tag {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--text-secondary);
          background-color: var(--bg);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .stock-price-row {
          display: flex;
          align-items: baseline;
          gap: 16px;
          margin-bottom: 16px;
        }

        .price-text {
          font-size: 2.8rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -1px;
        }

        .price-change-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 700;
          font-size: 1.15rem;
          padding: 4px 12px;
          border-radius: 30px;
        }

        .change-up {
          color: var(--stock-up);
          background-color: #FEECEF;
        }

        .change-down {
          color: var(--stock-down);
          background-color: var(--toss-blue-light);
        }

        /* Detail Tabs */
        .detail-tabs-bar {
          display: flex;
          border-bottom: 1px solid var(--border);
          margin-bottom: 24px;
          gap: 24px;
        }

        .detail-tab {
          background: none;
          border: none;
          padding: 16px 4px;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-light);
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: var(--transition);
          outline: none;
        }

        .detail-tab:hover {
          color: var(--text-primary);
        }

        .detail-tab-active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        /* Stats Grid */
        .stats-grid-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 20px;
        }

        .stat-item-box {
          background-color: var(--secondary-light);
          padding: 20px;
          border-radius: var(--border-radius-sm);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stat-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-light);
        }

        .stat-value {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        /* Order Widget Panel */
        .order-widget-card {
          padding: 32px !important;
          border-radius: var(--border-radius) !important;
          position: sticky;
          top: 40px;
        }

        .order-tab-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 24px;
        }

        .order-btn-toggle {
          padding: 14px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: var(--transition);
          outline: none;
        }

        .order-btn-buy {
          background-color: #FEECEF;
          color: var(--stock-up);
        }

        .order-btn-buy-active {
          background-color: var(--stock-up) !important;
          color: #ffffff !important;
          box-shadow: 0 4px 15px rgba(240, 68, 82, 0.25);
        }

        .order-btn-sell {
          background-color: var(--toss-blue-light);
          color: var(--stock-down);
        }

        .order-btn-sell-active {
          background-color: var(--stock-down) !important;
          color: #ffffff !important;
          box-shadow: 0 4px 15px rgba(49, 130, 246, 0.25);
        }

        .form-order-item {
          margin-bottom: 20px;
        }

        .order-price-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background-color: var(--bg);
          border-radius: 12px;
          font-weight: 800;
        }
      `}</style>

      {/* Top Nav Back Bar */}
      <div className="detail-top-nav-bar">
        <div className="container">
          <Button 
            variant="text" 
            onClick={() => navigate('/')} 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '0',
              fontWeight: 800,
              color: 'var(--text-secondary)'
            }}
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> 전체 주식 피드로 돌아가기
          </Button>
        </div>
      </div>

      <div className="container">
        <div className="stock-detail-layout">
          {/* Left Side: Chart and Company Info */}
          <div>
            <Card className="stock-header-card" hoverable={false}>
              <div className="stock-name-row">
                <div>
                  <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'inline', marginRight: '10px' }}>
                    {stockInfo.name}
                  </h1>
                  <span className="stock-badge-tag">{symbol ? symbol.toUpperCase() : 'AAPL'}</span>
                </div>
                <div style={{ color: 'var(--text-light)', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                  <RefreshCw size={14} /> 실시간 반영 중
                </div>
              </div>

              <div className="stock-price-row">
                <span className="price-text">₩{stockInfo.price.toLocaleString()}</span>
                <span className={`price-change-wrapper ${isUp ? 'change-up' : 'change-down'}`}>
                  {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {isUp ? '+' : ''}{stockInfo.change.toLocaleString()} ({isUp ? '+' : ''}{stockInfo.percent}%)
                </span>
              </div>

              {/* Detail Navigation Tabs */}
              <div className="detail-tabs-bar">
                <button 
                  className={`detail-tab ${activeTab === 'chart' ? 'detail-tab-active' : ''}`}
                  onClick={() => setActiveTab('chart')}
                >
                  시세 차트
                </button>
                <button 
                  className={`detail-tab ${activeTab === 'info' ? 'detail-tab-active' : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  종목 상세 및 통계
                </button>
              </div>

              {/* Active Tab Screen */}
              {activeTab === 'chart' ? (
                <div style={{ padding: '10px 0', animation: 'modalSlideUp 0.3s forwards' }}>
                  <StockChart data={chartData} isUp={isUp} />
                </div>
              ) : (
                <div style={{ animation: 'modalSlideUp 0.3s forwards' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
                    주요 거래 데이터 요약
                  </h3>
                  
                  <div className="stats-grid-list">
                    <div className="stat-item-box">
                      <span className="stat-label">
                        <BarChart2 size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> 시가 총액
                      </span>
                      <span className="stat-value">{stockInfo.cap}</span>
                    </div>

                    <div className="stat-item-box">
                      <span className="stat-label">
                        <DollarSign size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> 일일 거래량
                      </span>
                      <span className="stat-value">{stockInfo.vol}</span>
                    </div>

                    <div className="stat-item-box">
                      <span className="stat-label">52주 최고가</span>
                      <span className="stat-value" style={{ color: 'var(--stock-up)' }}>
                        ₩{(stockInfo.price * 1.18).toLocaleString()}
                      </span>
                    </div>

                    <div className="stat-item-box">
                      <span className="stat-label">52주 최저가</span>
                      <span className="stat-value" style={{ color: 'var(--stock-down)' }}>
                        ₩{(stockInfo.price * 0.82).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p style={{ marginTop: '24px', fontSize: '0.92rem', color: 'var(--text-light)', lineHeight: 1.6, fontWeight: 500 }}>
                    * 위 수치는 시뮬레이션용 Mock 데이터이며 투자 권유의 대상이 아닙니다. 실제 시장 거래 체결과는 다를 수 있습니다.
                  </p>
                </div>
              )}
            </Card>

            {/* Discussion CTA Box */}
            <Card hoverable={true} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px' }} onClick={() => navigate('/board')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--toss-blue-light)', color: 'var(--toss-blue)', display: 'flex', alignItems: 'center', justifyContext: 'center', justifyContent: 'center' }}>
                  <BookOpen size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '2px' }}>
                    {stockInfo.name} 주주 토론방으로 이동
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>
                    다른 주주들과 지금 실시간 시장 소식과 전망을 나누어보세요.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" style={{ fontWeight: 800 }}>입장하기</Button>
            </Card>
          </div>

          {/* Right Side: Mock Trade Widget */}
          <div>
            <Card className="order-widget-card" hoverable={false}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>간편 주문하기</h3>
              
              <div className="order-tab-row">
                <button 
                  className={`order-btn-toggle order-btn-buy ${isUp ? 'order-btn-buy-active' : ''}`}
                  onClick={() => setIsUp(true)}
                >
                  살래요
                </button>
                <button 
                  className={`order-btn-toggle order-btn-sell ${!isUp ? 'order-btn-sell-active' : ''}`}
                  onClick={() => setIsUp(false)}
                >
                  팔래요
                </button>
              </div>

              <div className="form-order-item">
                <label className="form-label" style={{ fontWeight: 800, marginBottom: '8px', display: 'block' }}>1주 주문 금액</label>
                <div className="order-price-box">
                  <span style={{ color: 'var(--text-secondary)' }}>₩</span>
                  <span style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{stockInfo.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="form-order-item">
                <label className="form-label" htmlFor="orderAmountInput" style={{ fontWeight: 800, marginBottom: '8px', display: 'block' }}>주문 수량</label>
                <input 
                  id="orderAmountInput"
                  type="number" 
                  className="form-input" 
                  min="1" 
                  defaultValue="1" 
                  style={{ textAlign: 'right', fontSize: '1.1rem', fontWeight: 800, paddingRight: '16px' }}
                />
              </div>

              <Button 
                variant="primary" 
                style={{ 
                  width: '100%', 
                  height: '52px', 
                  fontSize: '1.05rem', 
                  fontWeight: 800, 
                  marginTop: '16px',
                  backgroundColor: isUp ? 'var(--stock-up)' : 'var(--stock-down)',
                  borderColor: 'transparent'
                }}
                onClick={() => alert(`${stockInfo.name} 주문 접수가 완료되었습니다. (모의 거래)`)}
              >
                {isUp ? '매수 주문하기' : '매도 주문하기'}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default StockDetail;
