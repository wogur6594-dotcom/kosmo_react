import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import { Flame, Clock, Heart, Award, Sparkles, ArrowRight } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  // Signature Best Sellers dummy data with emotional user reviews & premium Unsplash assets
  const bestSellers = [
    {
      id: 1,
      name: '시그니처 탕종 우유 식빵',
      desc: '100% 유기농 밀가루와 국산 1등급 원유로 완성한, 결대로 찢어지는 쫄깃함의 대명사.',
      review: '“인생 식빵이에요. 잼 없이 그냥 뜯어먹어도 고소하고 너무 부드러워요!”',
      rating: '4.9',
      reviewsCount: '342',
      price: '5,500원',
      tag: 'BEST',
      badgeClass: 'badge-primary',
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      name: '달콤 가득 밤 식빵',
      desc: '국산 공주 알밤이 가득 들어있어 한 입 먹을 때마다 달콤함과 고소함이 쏟아집니다.',
      review: '“밤이 이렇게 많이 든 밤식빵은 처음이에요. 아이들이 정말 좋아합니다.”',
      rating: '4.8',
      reviewsCount: '198',
      price: '6,800원',
      tag: 'SIGNATURE',
      badgeClass: 'badge-accent',
      img: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      name: '롤치즈 블랙올리브 식빵',
      desc: '고소한 롤치즈와 짭조름한 블랙올리브가 콕콕 박혀 식사 대용으로 가장 인기 있는 건강 식빵.',
      review: '“아침에 살짝 구워 올리브오일에 찍어 먹으면 브런치 카페 부럽지 않아요.”',
      rating: '5.0',
      reviewsCount: '124',
      price: '6,200원',
      tag: 'NEW',
      badgeClass: 'badge-success',
      img: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <>
      <style>{`
        /* Hero Section */
        .hero-section {
          position: relative;
          padding: 120px 0;
          background: linear-gradient(135deg, #FAF5EF 0%, #F5EBE1 100%);
          overflow: hidden;
          text-align: left;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        @media (max-width: 768px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 40px 24px;
          }
        }

        .hero-sub {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: var(--accent);
          font-weight: 700;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        @media (max-width: 768px) {
          .hero-sub { justify-content: center; }
        }

        .hero-title {
          font-size: 3.2rem;
          line-height: 1.2;
          color: var(--text-heading);
          margin-bottom: 24px;
          font-weight: 800;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.2rem; }
        }

        .hero-desc {
          font-size: 1.1rem;
          color: var(--text-light);
          margin-bottom: 36px;
          max-width: 540px;
        }

        @media (max-width: 768px) {
          .hero-desc { margin: 0 auto 30px; }
        }

        .hero-image-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .hero-image {
          width: 100%;
          max-width: 420px;
          height: auto;
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; /* 오가닉 빵 모양 */
          box-shadow: var(--shadow-hover);
          border: 4px solid #ffffff;
          animation: breadFloat 6s ease-in-out infinite;
        }

        @keyframes breadFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }

        /* Features Section */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: -40px;
          position: relative;
          z-index: 10;
        }

        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
            margin-top: 20px;
          }
        }

        .feature-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        /* Signature Section */
        .card-img-wrapper {
          position: relative;
          height: 220px;
          margin: -24px -24px 20px -24px;
          overflow: hidden;
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition);
        }

        .card-base:hover .card-img {
          transform: scale(1.08);
        }

        .card-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 10;
        }

        .product-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }

        .product-price {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--primary);
        }

        /* Baking Timeline Section */
        .timeline-banner {
          background-color: var(--secondary-light);
          border-radius: var(--border-radius-lg);
          padding: 48px;
          border: 1px dashed var(--secondary);
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 40px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .timeline-banner {
            grid-template-columns: 1fr;
            padding: 24px;
            gap: 24px;
          }
        }

        .timeline-left {
          text-align: left;
        }

        .timeline-items-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .timeline-item {
          display: flex;
          align-items: center;
          gap: 20px;
          background: #ffffff;
          padding: 16px 20px;
          border-radius: var(--border-radius-sm);
          box-shadow: var(--shadow);
          border-left: 4px solid var(--accent);
          text-align: left;
        }
      `}</style>

      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-left">
            <div className="hero-sub">
              <Sparkles size={18} />
              <span>매일 아침 갓 구운 프리미엄 식빵</span>
            </div>
            <h1 className="hero-title">
              건강하고 맛있는<br />
              하루의 시작, Bready & Co.
            </h1>
            <p className="hero-desc">
              100% 유기농 밀가루와 프랑스산 명품 무염 버터만을 사용하여 손수 빚어냅니다. 
              탕종 공법으로 24시간 동안 천천히 숙성시켜 비교할 수 없는 쫄깃함과 부드러움을 선물합니다.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
                식빵 메뉴 보기 <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/intro')}>
                브랜드 스토리
              </Button>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600&auto=format&fit=crop" 
              alt="Bready and Co Fresh Bread" 
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Features Cards Section */}
      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="features-grid">
            <Card hoverable={true}>
              <div className="feature-icon-wrapper">
                <Heart size={24} fill="currentColor" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>100% 천연발효종 & 유기농</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                화학 첨가제나 보존제를 일절 사용하지 않고, 탕종 공법과 유기농 밀가루만으로 속이 편안한 식빵을 만듭니다.
              </p>
            </Card>

            <Card hoverable={true}>
              <div className="feature-icon-wrapper">
                <Flame size={24} fill="currentColor" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>매일 아침 직접 베이킹</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                당일 생산, 당일 판매 원칙을 지키며 매일 아침 매장에서 신선한 온도와 정성으로 직접 빵을 굽습니다.
              </p>
            </Card>

            <Card hoverable={true}>
              <div className="feature-icon-wrapper">
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>차별화된 탕종 숙성 공법</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                뜨거운 물로 밀가루를 익혀 반죽하는 탕종 기법으로 수분 함량을 극대화하여 오랜 시간 촉촉함이 유지됩니다.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="section" style={{ backgroundColor: '#FAF8F5' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">signature menu</span>
            <h2 className="section-title">비교할 수 없는 3대 시그니처 식빵</h2>
            <p className="section-desc">가장 많은 사랑을 받는 베스트 상품들을 만나보세요.</p>
          </div>

          <div className="grid grid-3">
            {bestSellers.map((item) => (
              <Card key={item.id} hoverable={true} onClick={() => navigate('/products')} style={{ padding: '24px 24px 30px 24px' }}>
                <div className="card-img-wrapper">
                  <span className={`badge ${item.badgeClass} card-tag`}>{item.tag}</span>
                  <img src={item.img} alt={item.name} className="card-img" />
                </div>
                
                {/* Rating Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ color: '#E28723', fontSize: '1rem', display: 'flex', alignItems: 'center' }}>⭐⭐⭐⭐⭐</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 700 }}>{item.rating}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>({item.reviewsCount} 리뷰)</span>
                </div>

                <h3 style={{ fontSize: '1.28rem', marginBottom: '8px', color: 'var(--text-heading)', fontWeight: 800 }}>{item.name}</h3>
                
                <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', marginBottom: '12px', lineHeight: 1.5 }}>
                  {item.desc}
                </p>

                {/* Emotional Review Box */}
                <div style={{ 
                  backgroundColor: '#FAF5EF', 
                  borderRadius: '10px', 
                  padding: '12px 14px', 
                  marginBottom: '24px', 
                  borderLeft: '3px solid var(--accent)'
                }}>
                  <p style={{ 
                    fontSize: '0.82rem', 
                    fontStyle: 'italic', 
                    color: 'var(--primary)', 
                    margin: 0, 
                    lineHeight: 1.4,
                    fontWeight: 600
                  }}>
                    {item.review}
                  </p>
                </div>

                <div className="product-price-row" style={{ marginTop: 'auto' }}>
                  <span className="product-price" style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 800 }}>{item.price}</span>
                  <span className="soft-bounce-hover" style={{ 
                    fontSize: '0.88rem', 
                    color: 'var(--accent)', 
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    구매하기 &rarr;
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Baking Schedule Info */}
      <section className="section">
        <div className="container">
          <div className="timeline-banner">
            <div className="timeline-left">
              <span className="section-subtitle" style={{ fontSize: '0.95rem' }}>freshly baked guide</span>
              <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--text-heading)' }}>
                시간을 맞춰 방문하시면<br />
                더 따뜻한 빵을 만날 수 있어요
              </h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '24px', fontSize: '0.95rem' }}>
                빵이 나오는 시간에는 매장 가득 퍼지는 고소한 향기와 함께 가장 맛있는 상태의 따끈따끈한 식빵을 구매하실 수 있습니다.
              </p>
              <Button variant="primary" onClick={() => navigate('/intro')}>
                제조과정 자세히 보기
              </Button>
            </div>
            
            <div className="timeline-items-wrapper">
              <div className="timeline-item">
                <Clock size={24} style={{ color: 'var(--primary)' }} />
                <div>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>오전 08:30 <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 'bold' }}>[우유 식빵]</span></h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>시그니처 탕종 우유 식빵, 100% 우유 모닝빵이 갓 구워져 나옵니다.</p>
                </div>
              </div>

              <div className="timeline-item">
                <Clock size={24} style={{ color: 'var(--primary)' }} />
                <div>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>오전 10:00 <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 'bold' }}>[밤 & 치즈 식빵]</span></h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>달콤 가득 밤 식빵, 롤치즈 블랙올리브 식빵, 퐁듀 크림치즈 브레드가 나옵니다.</p>
                </div>
              </div>

              <div className="timeline-item">
                <Clock size={24} style={{ color: 'var(--primary)' }} />
                <div>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>오후 01:30 <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 'bold' }}>[데니쉬 & 페이스트리]</span></h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>프리미엄 초코 마블 데니쉬, 메이플 피칸 식빵, 몽블랑 데니쉬가 구워집니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
