import React, { useState } from 'react';
import Button from '../common/Button';
import { Star, Info } from 'lucide-react';

function ProductDetail({ product, onAddToCart, onBuyNow }) {
  const [qty, setQty] = useState(1);

  if (!product) return <div style={{ padding: '40px', textAlign: 'center' }}>상품을 선택해 주세요.</div>;

  return (
    <>
      <style>{`
        .detail-layout-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
        }

        @media (max-width: 640px) {
          .detail-layout-inner { grid-template-columns: 1fr; gap: 24px; }
        }

        .det-left-img-box {
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          box-shadow: var(--shadow);
          height: 100%;
          min-height: 300px;
        }

        .det-left-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .det-right-content {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .det-meta-rating {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
          color: var(--text-light);
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
        }

        .det-rating-star {
          color: #FFC107;
          fill: #FFC107;
        }

        .det-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text);
        }

        .det-info-box {
          background-color: var(--secondary-light);
          padding: 16px;
          border-radius: var(--border-radius-sm);
          border-left: 3px solid var(--secondary);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .det-info-row {
          display: flex;
          font-size: 0.85rem;
          line-height: 1.5;
        }

        .det-info-label {
          width: 75px;
          font-weight: 700;
          color: var(--text-heading);
          flex-shrink: 0;
        }

        .det-info-text {
          color: var(--text);
        }

        .det-qty-selector {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 10px;
        }

        .det-qty-input-box {
          display: flex;
          align-items: center;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          background-color: var(--bg);
        }

        .det-qty-adjust-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: none;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
          color: var(--text);
        }

        .det-qty-adjust-btn:hover {
          background-color: var(--border);
          color: var(--primary);
        }

        .det-qty-value {
          width: 44px;
          text-align: center;
          font-weight: 700;
          font-size: 0.95rem;
        }
      `}</style>

      <div className="detail-layout-inner">
        <div className="det-left-img-box">
          <img src={product.img} alt={product.name} className="det-left-img" />
        </div>
        
        <div className="det-right-content">
          <span className={`badge ${product.badgeClass}`} style={{ width: 'fit-content' }}>
            {product.tag}
          </span>
          
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-heading)' }}>{product.name}</h2>
          
          <div className="det-meta-rating">
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={16} className="det-rating-star" />
              <span style={{ fontWeight: 'bold', color: 'var(--text-heading)' }}>{product.rating}</span>
            </div>
            <span>|</span>
            <span>구매 후기 {product.reviews}개</span>
          </div>
          
          <p className="det-desc">{product.desc}</p>
          
          {/* Ingredient Details */}
          <div className="det-info-box">
            <div className="det-info-row">
              <span className="det-info-label"><Info size={14} style={{ marginRight: '4px', display: 'inline' }} /> 성분 표시</span>
              <span className="det-info-text">{product.ingredients}</span>
            </div>
            <div className="det-info-row">
              <span className="det-info-label">칼로리</span>
              <span className="det-info-text">{product.calories}</span>
            </div>
            <div className="det-info-row">
              <span className="det-info-label">보관 방법</span>
              <span className="det-info-text">{product.storage}</span>
            </div>
          </div>

          {/* Qty Selector & Action Buttons */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>주문 수량</span>
              <div className="det-qty-selector">
                <div className="det-qty-input-box">
                  <button 
                    className="det-qty-adjust-btn"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="det-qty-value">{qty}</span>
                  <button 
                    className="det-qty-adjust-btn"
                    onClick={() => setQty(qty + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 600 }}>총 금액</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                {(product.price * qty).toLocaleString()}원
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (onAddToCart) onAddToCart(product, qty);
                  else alert(`${product.name} ${qty}개를 장바구니에 담았습니다.`);
                }}
              >
                장바구니 담기
              </Button>
              <Button 
                variant="primary"
                onClick={() => {
                  if (onBuyNow) onBuyNow(product, qty);
                  else alert(`${product.name} ${qty}개 바로 구매 페이지로 이동합니다.`);
                }}
              >
                바로 구매하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
