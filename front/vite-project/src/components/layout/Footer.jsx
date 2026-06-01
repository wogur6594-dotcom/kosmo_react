import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <>
      <style>{`
        .footer-outer {
          background-color: #2D1F17; /* 다크 에스프레소 웜 브라운 */
          color: #D2C4BB;
          padding: 60px 0 30px;
          margin-top: auto;
          border-top: 2px solid var(--primary);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1.5fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          font-size: 1.3rem;
          color: #FFFDF9;
        }

        .footer-logo-icon {
          color: var(--accent);
        }

        .footer-desc {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #9E8E84;
        }

        .footer-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #FFFDF9;
          position: relative;
          padding-bottom: 8px;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 2px;
          background-color: var(--accent);
        }

        .footer-info-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 0.9rem;
        }

        .footer-info-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .footer-info-item svg {
          color: var(--accent);
          flex-shrink: 0;
          margin-top: 3px;
        }

        /* Baking Time Table Section */
        .baking-badge {
          background-color: var(--primary);
          color: #ffffff;
          padding: 2px 6px;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 4px;
          margin-right: 8px;
          display: inline-block;
        }

        .baking-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.9rem;
        }

        .social-links {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }

        .social-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #3D2D23;
          color: #D2C4BB;
          transition: var(--transition);
        }

        .social-icon-btn:hover {
          background-color: var(--accent);
          color: white;
          transform: translateY(-2px);
        }

        .footer-bottom {
          border-top: 1px solid #3D2D23;
          padding-top: 24px;
          text-align: center;
          font-size: 0.8rem;
          color: #8E7D72;
        }
      `}</style>

      <footer className="footer-outer">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1: Brand & Desc */}
            <div className="footer-col">
              <div className="footer-logo">
                <Flame className="footer-logo-icon" size={22} fill="currentColor" />
                <span>Bready & Co.</span>
              </div>
              <p className="footer-desc">
                유기농 재료와 프랑스산 무염 버터, 그리고 천연 발효종을 고집하여 매일 아침 매장에서 정성껏 구워내는 식빵 전문점입니다. 화학 첨가물 없이 정성으로 완성한 프리미엄 식빵의 식감과 풍미를 느껴보세요.
              </p>
              <div className="social-links">
                <a href="#instagram" className="social-icon-btn" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="#facebook" className="social-icon-btn" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Baking Time Table */}
            <div className="footer-col">
              <h4 className="footer-title">갓 구운 식빵 시간표</h4>
              <ul className="baking-list">
                <li>
                  <span className="baking-badge">08:30</span>
                  촉촉한 시그니처 우유 식빵
                </li>
                <li>
                  <span className="baking-badge">10:00</span>
                  달콤 든든 밤 식빵 & 롤치즈 식빵
                </li>
                <li>
                  <span className="baking-badge">11:30</span>
                  담백 고소 무화과 통밀 식빵
                </li>
                <li>
                  <span className="baking-badge">13:30</span>
                  프리미엄 페이스트리 데니쉬 식빵
                </li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div className="footer-col">
              <h4 className="footer-title">고객센터 & 매장 정보</h4>
              <ul className="footer-info-list">
                <li className="footer-info-item">
                  <Phone size={16} />
                  <div>
                    <strong style={{ color: '#FFFDF9' }}>02-1234-5678</strong>
                    <p style={{ fontSize: '0.8rem', color: '#8E7D72' }}>오전 08:30 ~ 오후 08:00 (빵 소진 시 조기 마감)</p>
                  </div>
                </li>
                <li className="footer-info-item">
                  <MapPin size={16} />
                  <div>
                    서울특별시 마포구 베이커리길 100, 1층<br />
                    Bready & Co. 본점
                  </div>
                </li>
                <li className="footer-info-item">
                  <Clock size={16} />
                  <div>
                    매주 월요일 휴무<br />
                    화 ~ 일: 08:30 ~ 20:00
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Bready & Co. All rights reserved. Designed for Premium Bakery Experience.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
