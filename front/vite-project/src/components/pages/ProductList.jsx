import React, { useState } from 'react';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { ShoppingBag, Eye, Heart, Info, Star } from 'lucide-react';

// Bread Product Data
const PRODUCTS = [
  {
    id: 1,
    category: 'classic',
    name: '시그니처 탕종 우유 식빵',
    price: 5500,
    priceStr: '5,500원',
    tag: 'BEST',
    badgeClass: 'badge-primary',
    desc: '100% 유기농 밀가루와 국산 1등급 우유로 완성한, 결대로 부드럽게 찢어지는 시그니처 식빵.',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    reviews: 142,
    ingredients: '유기농 강력분(캐나다산), 국산 1등급 우유, 유기농 비정제 설탕, 가공 천일염, 천연 르방',
    calories: '240 kcal (1회 제공량 80g당)',
    storage: '실온 2일 보관 권장. 장기 보관 시 슬라이스하여 지퍼백에 넣은 후 냉동 보관하세요.'
  },
  {
    id: 2,
    category: 'sweet',
    name: '달콤 가득 밤 식빵',
    price: 6800,
    priceStr: '6,800원',
    tag: 'BEST',
    badgeClass: 'badge-primary',
    desc: '충청남도 공주의 알밤이 가득 들어있어 한 입 먹을 때마다 묵직한 달콤함과 촉촉함이 입안 가득 쏟아집니다.',
    img: 'https://images.unsplash.com/photo-1534620808146-d33bb39128b2?q=80&w=600&auto=format&fit=crop',
    rating: 4.8,
    reviews: 98,
    ingredients: '유기농 강력분(캐나다산), 국내산 공주 통밤, 프랑스 엘르앤비르 버터, 계란, 설탕, 이스트',
    calories: '280 kcal (1회 제공량 80g당)',
    storage: '실온 1일 보관 권장. 실온에서 보관하시고 드시기 전 전자레인지에 20초간 데우면 갓 구운 맛이 납니다.'
  },
  {
    id: 3,
    category: 'classic',
    name: '롤치즈 블랙올리브 식빵',
    price: 6200,
    priceStr: '6,200원',
    tag: 'SIGNATURE',
    badgeClass: 'badge-accent',
    desc: '고소하고 진한 체다&모짜렐라 롤치즈와 짭조름하게 숙성된 블랙올리브가 콕콕 박혀 식사 대용으로 강력히 추천하는 영양 식빵.',
    img: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600&auto=format&fit=crop',
    rating: 4.7,
    reviews: 74,
    ingredients: '유기농 강력분(캐나다산), 체다 롤치즈(미국산), 블랙 올리브슬라이스(스페인산), 올리브유, 천일염',
    calories: '265 kcal (1회 제공량 80g당)',
    storage: '실온 2일 보관 권장. 올리브오일과 함께 발사믹 식초를 곁들여 찍어 드시면 맛이 배가됩니다.'
  },
  {
    id: 4,
    category: 'healthy',
    name: '담백 오가닉 통밀 식빵',
    price: 5800,
    priceStr: '5,800원',
    tag: 'HEALTHY',
    badgeClass: 'badge-success',
    desc: '영양이 고스란히 담긴 통밀가루와 호두, 해바라기씨 등 5가지 견과류를 듬뿍 넣어 씹을수록 구수하고 든든한 식이섬유 식빵.',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
    rating: 4.6,
    reviews: 62,
    ingredients: '유기농 호밀/통밀(캐나다산), 호두(미국산), 해바라기씨, 아마씨, 오트밀, 천연 르방, 메이플 시럽',
    calories: '210 kcal (1회 제공량 80g당)',
    storage: '실온 3일 보관 가능. 가볍게 토스트하여 아보카도나 잼을 발라 드시기에 최적인 브런치 전용 식빵입니다.'
  },
  {
    id: 5,
    category: 'sweet',
    name: '프리미엄 벨지안 초코 마블 식빵',
    price: 7200,
    priceStr: '7,200원',
    tag: 'NEW',
    badgeClass: 'badge-accent',
    desc: '벨기에산 진한 다크 초콜릿 리플잼을 데니쉬 페이스트리 결 사이에 가득 짜 넣어 달콤하고 깊은 카카오 향이 물씬 풍기는 명품 식빵.',
    img: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600&auto=format&fit=crop',
    rating: 4.9,
    reviews: 55,
    ingredients: '유기농 강력분, 벨기에산 다크 초콜릿 칩 & 코코아 리플잼, 프랑스 버터, 코코아파우더, 무당연유',
    calories: '310 kcal (1회 제공량 80g당)',
    storage: '실온 2일 보관 권장. 커피나 흰 우유와 곁들이면 최고의 애프터눈 티 브레드가 됩니다.'
  },
  {
    id: 6,
    category: 'sweet',
    name: '허니 시나몬 페이스트리 식빵',
    price: 6500,
    priceStr: '6,500원',
    tag: 'NEW',
    badgeClass: 'badge-accent',
    desc: '천연 꿀과 향긋한 시나몬 시럽이 돌돌 감겨 있으며, 오븐에서 바삭하게 구워내 겉은 바삭하고 속은 부드러운 페이스트리식 식빵.',
    img: 'https://images.unsplash.com/photo-1534620808146-d33bb39128b2?q=80&w=600&auto=format&fit=crop',
    rating: 4.5,
    reviews: 41,
    ingredients: '유기농 강력분, 국산 천연 아카시아 벌꿀, 베트남 시나몬 파우더, 프랑스 고메 버터, 갈색설탕',
    calories: '295 kcal (1회 제공량 80g당)',
    storage: '실온 2일 보관 권장. 실온 보관 시 에어프라이어 170도에서 3분간 데우면 겉바속촉이 극대화됩니다.'
  }
];

function ProductList() {
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartCount, setCartCount] = useState(1);

  // Filtering
  const filteredProducts = PRODUCTS.filter((prod) => {
    if (category === 'all') return true;
    return prod.category === category;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'popular') return b.rating - a.rating;
    if (sortBy === 'low-price') return a.price - b.price;
    if (sortBy === 'high-price') return b.price - a.price;
    return 0;
  });

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setCartCount(1); // reset quantity counter in detail modal
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <style>{`
        /* Filter Controls */
        .filter-controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          background-color: var(--card-bg);
          border: 1px solid var(--border);
          color: var(--text-light);
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .filter-btn:hover {
          color: var(--primary);
          border-color: var(--primary);
          background-color: var(--primary-light);
        }

        .filter-btn-active {
          background-color: var(--primary);
          color: #ffffff !important;
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(139, 90, 43, 0.15);
        }

        .sort-select {
          padding: 10px 16px;
          border-radius: 20px;
          border: 1px solid var(--border);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: var(--text);
          outline: none;
          cursor: pointer;
          background-color: var(--card-bg);
          transition: var(--transition);
        }

        .sort-select:focus {
          border-color: var(--primary);
        }

        /* Product Cards Details */
        .product-grid {
          margin-bottom: 80px;
        }

        .prod-img-box {
          position: relative;
          height: 240px;
          margin: -24px -24px 20px -24px;
          overflow: hidden;
        }

        .prod-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition);
        }

        .prod-card:hover .prod-img {
          transform: scale(1.06);
        }

        .hover-actions-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(45, 31, 23, 0.4);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: var(--transition);
          backdrop-filter: blur(2px);
        }

        .prod-card:hover .hover-actions-overlay {
          opacity: 1;
        }

        .action-circle-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: #ffffff;
          color: var(--text-heading);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          transition: var(--transition);
        }

        .action-circle-btn:hover {
          background-color: var(--primary);
          color: #ffffff;
          transform: scale(1.1);
        }

        .prod-name-title {
          font-size: 1.15rem;
          margin-bottom: 8px;
          text-align: left;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-light);
          margin-bottom: 12px;
        }

        .rating-star {
          color: #FFC107;
          fill: #FFC107;
        }

        .prod-desc-text {
          font-size: 0.85rem;
          color: var(--text-light);
          text-align: left;
          margin-bottom: 24px;
          line-height: 1.5;
          flex: 1;
        }

        /* Detail Modal Contents */
        .detail-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
        }

        @media (max-width: 640px) {
          .detail-layout { grid-template-columns: 1fr; gap: 24px; }
        }

        .detail-left-img-box {
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          box-shadow: var(--shadow);
          height: 100%;
          min-height: 300px;
        }

        .detail-left-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detail-right-content {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .detail-meta-rating {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
          color: var(--text-light);
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
        }

        .detail-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text);
        }

        .info-card-box {
          background-color: var(--secondary-light);
          padding: 16px;
          border-radius: var(--border-radius-sm);
          border-left: 3px solid var(--secondary);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-row {
          display: flex;
          font-size: 0.85rem;
          line-height: 1.5;
        }

        .info-label {
          width: 75px;
          font-weight: 700;
          color: var(--text-heading);
          flex-shrink: 0;
        }

        .info-text {
          color: var(--text);
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 10px;
        }

        .qty-input-box {
          display: flex;
          align-items: center;
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          background-color: var(--bg);
        }

        .qty-adjust-btn {
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

        .qty-adjust-btn:hover {
          background-color: var(--border);
          color: var(--primary);
        }

        .qty-value {
          width: 44px;
          text-align: center;
          font-weight: 700;
          font-size: 0.95rem;
        }
      `}</style>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">our menu list</span>
            <h2 className="section-title">Bready & Co.의 건강 식빵 메뉴</h2>
            <p className="section-desc">
              고소하고 신선한 향기가 가득 담긴 천연 숙성 식빵 라인업입니다.<br />
              당일 구워진 제품만을 엄선해 선보입니다.
            </p>
          </div>

          {/* Filter Controls Row */}
          <div className="filter-controls-row">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${category === 'all' ? 'filter-btn-active' : ''}`}
                onClick={() => setCategory('all')}
              >
                전체 식빵
              </button>
              <button 
                className={`filter-btn ${category === 'classic' ? 'filter-btn-active' : ''}`}
                onClick={() => setCategory('classic')}
              >
                시그니처 식빵
              </button>
              <button 
                className={`filter-btn ${category === 'healthy' ? 'filter-btn-active' : ''}`}
                onClick={() => setCategory('healthy')}
              >
                곡물/건강 식빵
              </button>
              <button 
                className={`filter-btn ${category === 'sweet' ? 'filter-btn-active' : ''}`}
                onClick={() => setCategory('sweet')}
              >
                디저트/달콤 식빵
              </button>
            </div>

            <select 
              className="sort-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
            >
              <option value="popular">인기순 추천</option>
              <option value="low-price">가격 낮은 순</option>
              <option value="high-price">가격 높은 순</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-3 product-grid">
            {sortedProducts.map((prod) => (
              <Card 
                key={prod.id} 
                className="prod-card" 
                hoverable={true}
                onClick={() => handleOpenDetail(prod)}
              >
                <div className="prod-img-box">
                  <span className={`badge ${prod.badgeClass} card-tag`}>{prod.tag}</span>
                  <img src={prod.img} alt={prod.name} className="prod-img" />
                  
                  {/* Hover Actions */}
                  <div className="hover-actions-overlay">
                    <button 
                      className="action-circle-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(prod);
                      }}
                      aria-label="View product details"
                    >
                      <Eye size={20} />
                    </button>
                    <button 
                      className="action-circle-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`${prod.name}을 장바구니에 담았습니다.`);
                      }}
                      aria-label="Add to cart"
                    >
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                </div>

                <h3 className="prod-name-title">{prod.name}</h3>
                
                <div className="rating-row">
                  <Star size={14} className="rating-star" />
                  <span style={{ fontWeight: 'bold', color: 'var(--text-heading)' }}>{prod.rating}</span>
                  <span>({prod.reviews}개의 후기)</span>
                </div>

                <p className="prod-desc-text">{prod.desc}</p>
                
                <div className="product-price-row">
                  <span className="product-price">{prod.priceStr}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>상세보기 &rarr;</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <Modal
        isOpen={selectedProduct !== null}
        onClose={handleCloseDetail}
        title={selectedProduct ? selectedProduct.name : ''}
        size="lg"
      >
        {selectedProduct && (
          <div className="detail-layout">
            <div className="detail-left-img-box">
              <img src={selectedProduct.img} alt={selectedProduct.name} className="detail-left-img" />
            </div>
            
            <div className="detail-right-content">
              <span className={`badge ${selectedProduct.badgeClass}`} style={{ width: 'fit-content' }}>
                {selectedProduct.tag}
              </span>
              
              <h2 style={{ fontSize: '1.75rem', color: 'var(--text-heading)' }}>{selectedProduct.name}</h2>
              
              <div className="detail-meta-rating">
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={16} className="rating-star" />
                  <span style={{ fontWeight: 'bold', color: 'var(--text-heading)' }}>{selectedProduct.rating}</span>
                </div>
                <span>|</span>
                <span>구매 후기 {selectedProduct.reviews}개</span>
              </div>
              
              <p className="detail-desc">{selectedProduct.desc}</p>
              
              {/* Product Info Bullet Cards */}
              <div className="info-card-box">
                <div className="info-row">
                  <span className="info-label"><Info size={14} style={{ marginRight: '4px', display: 'inline' }} /> 성분 표시</span>
                  <span className="info-text">{selectedProduct.ingredients}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">칼로리</span>
                  <span className="info-text">{selectedProduct.calories}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">보관 방법</span>
                  <span className="info-text">{selectedProduct.storage}</span>
                </div>
              </div>

              {/* Quantity Selector & Purchase Button */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>주문 수량</span>
                  <div className="quantity-selector">
                    <div className="qty-input-box">
                      <button 
                        className="qty-adjust-btn"
                        onClick={() => setCartCount(Math.max(1, cartCount - 1))}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="qty-value">{cartCount}</span>
                      <button 
                        className="qty-adjust-btn"
                        onClick={() => setCartCount(cartCount + 1)}
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
                    {(selectedProduct.price * cartCount).toLocaleString()}원
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      alert(`${selectedProduct.name} ${cartCount}개를 장바구니에 담았습니다.`);
                      handleCloseDetail();
                    }}
                  >
                    장바구니 담기
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={() => {
                      alert(`${selectedProduct.name} ${cartCount}개 바로 구매 페이지로 이동합니다.`);
                      handleCloseDetail();
                    }}
                  >
                    바로 구매하기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default ProductList;
export { PRODUCTS }; // Export data so other components can use it
