import React from 'react';
import { Sparkles, Heart, RefreshCw, Star } from 'lucide-react';

function ProductIntro() {
  return (
    <>
      <style>{`
        .intro-hero {
          background: linear-gradient(rgba(45, 31, 23, 0.7), rgba(45, 31, 23, 0.7)), 
                      url('https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop') no-repeat center/cover;
          color: white;
          padding: 100px 0;
          text-align: center;
        }

        .intro-hero-title {
          font-family: var(--font-serif);
          font-size: 2.6rem;
          color: #FFFDF9;
          margin-bottom: 16px;
        }

        .intro-hero-desc {
          font-size: 1.1rem;
          color: #D2C4BB;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Story Section */
        .story-section {
          padding: 80px 0;
        }

        .story-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          text-align: left;
        }

        @media (max-width: 768px) {
          .story-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .story-subtitle {
          font-family: var(--font-serif);
          color: var(--accent);
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .story-title {
          font-size: 2.2rem;
          margin-bottom: 24px;
          line-height: 1.35;
        }

        .story-text {
          font-size: 1.05rem;
          color: var(--text-light);
          margin-bottom: 20px;
          line-height: 1.8;
        }

        .story-img-wrapper {
          position: relative;
        }

        .story-img {
          width: 100%;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-hover);
        }

        .story-badge {
          position: absolute;
          bottom: -20px;
          right: -20px;
          background-color: var(--primary);
          color: white;
          padding: 20px 30px;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-hover);
          font-family: var(--font-serif);
          text-align: center;
        }

        /* Ingredients Grid */
        .ing-card {
          background-color: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--border-radius);
          padding: 30px;
          text-align: center;
          box-shadow: var(--shadow);
          transition: var(--transition);
        }

        .ing-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-hover);
          border-color: var(--accent);
        }

        .ing-icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .ing-title {
          font-size: 1.25rem;
          color: var(--text-heading);
          margin-bottom: 12px;
        }

        .ing-desc {
          font-size: 0.9rem;
          color: var(--text-light);
          line-height: 1.6;
        }

        /* Process Steps */
        .process-flow {
          display: flex;
          flex-direction: column;
          gap: 40px;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .process-flow::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 40px;
          width: 2px;
          background-color: var(--border);
          z-index: 1;
        }

        @media (max-width: 640px) {
          .process-flow::before {
            left: 20px;
          }
        }

        .process-step {
          display: flex;
          gap: 30px;
          position: relative;
          z-index: 2;
        }

        .process-num {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: var(--card-bg);
          border: 2px solid var(--accent);
          color: var(--accent);
          font-weight: 800;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--shadow);
        }

        @media (max-width: 640px) {
          .process-num {
            width: 40px;
            height: 40px;
            font-size: 1.1rem;
          }
        }

        .process-content {
          background-color: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--border-radius);
          padding: 24px;
          box-shadow: var(--shadow);
          text-align: left;
          flex: 1;
        }

        .process-step-title {
          font-size: 1.2rem;
          color: var(--text-heading);
          margin-bottom: 8px;
        }

        .process-step-desc {
          font-size: 0.9rem;
          color: var(--text-light);
          line-height: 1.6;
        }
      `}</style>

      {/* Intro Hero */}
      <section className="intro-hero">
        <div className="container">
          <h1 className="intro-hero-title">건강한 기다림, 빵을 굽다</h1>
          <p className="intro-hero-desc">
            Bready & Co.는 빠르게 빵을 찍어내지 않습니다. 
            하루에 필요한 수량만큼 정직하게 밀가루를 치대고, 천연 르방을 키워 느림의 풍미를 만듭니다.
          </p>
        </div>
      </section>

      {/* Story 1 */}
      <section className="story-section">
        <div className="container">
          <div className="story-container">
            <div className="story-left">
              <span className="story-subtitle">Our Philosophy</span>
              <h2 className="story-title">소화가 잘되는 식빵,<br />그 해답은 자연 숙성에 있습니다</h2>
              <p className="story-text">
                "왜 시판 빵을 먹으면 속이 더부룩할까?" 라는 아주 단순한 질문에서 Bready & Co.가 시작되었습니다. 
                우리는 화학 유화제나 글루텐 강화제 등 인위적인 부재료를 절대 넣지 않습니다.
              </p>
              <p className="story-text">
                대신, 물과 밀가루를 먼저 익혀 반죽하는 <strong>'탕종 공법'</strong>을 통해 자연스러운 촉촉함과 쫄깃함을 채웠습니다. 
                여기에 직접 키운 <strong>천연 르방(효모종)</strong>을 넣어 발효 속도는 느리지만 깊은 풍미를 유도하며, 
                글루텐 분해가 충분히 이루어져 빵을 드신 후에도 속이 아주 편안합니다.
              </p>
            </div>
            <div className="story-img-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600&auto=format&fit=crop" 
                alt="Bread details" 
                className="story-img"
              />
              <div className="story-badge">
                <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8 }}>SINCE 2024</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Bready & Co.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients Grid */}
      <section className="section" style={{ backgroundColor: '#FAF8F5' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">four ingredients</span>
            <h2 className="section-title">최고만을 고집하는 4가지 원칙</h2>
            <p className="section-desc">우리의 모든 식빵에 들어가는 4대 프리미엄 원재료입니다.</p>
          </div>

          <div className="grid grid-4">
            <div className="ing-card">
              <div className="ing-icon-circle">
                <Heart size={26} fill="currentColor" />
              </div>
              <h3 className="ing-title">100% 유기농 밀가루</h3>
              <p className="ing-desc">화학 농약과 화학 비료 없이 건강한 유기농 공법으로 제분하여 풍부한 고소함을 담았습니다.</p>
            </div>

            <div className="ing-card">
              <div className="ing-icon-circle">
                <RefreshCw size={26} />
              </div>
              <h3 className="ing-title">천연 야생 발효 르방</h3>
              <p className="ing-desc">과일과 밀가루를 이용해 직접 배양한 천연 유산균 효모종을 사용해 깊은 아로마와 부드러운 산미를 냅니다.</p>
            </div>

            <div className="ing-card">
              <div className="ing-icon-circle">
                <Star size={26} fill="currentColor" />
              </div>
              <h3 className="ing-title">프랑스 고메 무염버터</h3>
              <p className="ing-desc">인조 가공 버터(마가린, 쇼트닝)는 제로. 프랑스 최고급 원유로 전통 생산한 천연 고메 버터만을 듬뿍 넣습니다.</p>
            </div>

            <div className="ing-card">
              <div className="ing-icon-circle">
                <Sparkles size={26} />
              </div>
              <h3 className="ing-title">천일염 & 탕종 공법</h3>
              <p className="ing-desc">정제염 대신 미네랄이 살아있는 천일염을 사용하여 건강하고 깊은 감칠맛을 완성합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">24-hour journey</span>
            <h2 className="section-title">식빵 하나가 태어나는 24시간의 여정</h2>
            <p className="section-desc">한 조각의 식빵을 위해 정직과 땀으로 지키는 베이킹 과정입니다.</p>
          </div>

          <div className="process-flow">
            <div className="process-step">
              <div className="process-num">01</div>
              <div className="process-content">
                <h4 className="process-step-title">탕종 반죽의 호화 (오전 09:00)</h4>
                <p className="process-step-desc">
                  밀가루의 전분을 뜨거운 물로 먼저 익혀 수분을 머금도록 하는 호화(Gelatinization) 공정을 거칩니다. 
                  이 과정이 빵의 탄력과 쫄깃함을 결정합니다.
                </p>
              </div>
            </div>

            <div className="process-step">
              <div className="process-num">02</div>
              <div className="process-content">
                <h4 className="process-step-title">천연 르방 믹싱 & 저온 1차 발효 (오전 11:30)</h4>
                <p className="process-step-desc">
                  탕종 반죽에 유기농 밀가루, 고메 버터, 천일염, 그리고 매일 관리하는 생효모 르방을 혼합하여 글루텐을 정교하게 잡은 후, 
                  4℃의 발효실에서 18시간 동안 저온 1차 발효를 시작합니다.
                </p>
              </div>
            </div>

            <div className="process-step">
              <div className="process-num">03</div>
              <div className="process-content">
                <h4 className="process-step-title">정교한 분할 & 둥글리기 (다음 날 새벽 05:00)</h4>
                <p className="process-step-desc">
                  밤새 저온 숙성된 반죽을 식빵 종류에 맞는 최적의 무게로 분할한 뒤, 반죽 표면을 부드럽게 둥글려 숨을 고르게 하고 
                  중간 휴지(Benching) 타임을 가집니다.
                </p>
              </div>
            </div>

            <div className="process-step">
              <div className="process-num">04</div>
              <div className="process-content">
                <h4 className="process-step-title">데크 오븐에서 완성되는 구움색 (다음 날 아침 08:00)</h4>
                <p className="process-step-desc">
                  전용 식빵팬에 담긴 반죽이 2차 발효를 마친 뒤, 고열의 전통 데크 오븐에 들어갑니다. 
                  은은한 골든 브라운의 고소한 식빵 테두리가 형성되며 한 김 식힌 뒤 슬라이스하여 매장에 진열됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductIntro;
