import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Search, Calendar, User, Info, FileText, PenTool, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';

// Notice Mock Data
const MOCK_NOTICES = [
  {
    id: 1,
    type: 'notice',
    typeStr: '공지',
    badgeClass: 'badge-danger',
    title: 'Bready & Co. 오가닉 식빵 가격 조정 안내',
    content: `안녕하세요, Bready & Co.를 사랑해 주시는 고객 여러분.
우리는 최고의 식빵을 만들기 위해 100% 유기농 밀가루와 프랑스산 고메 버터, 국내산 천일염 등 최상급 원재료만을 엄선하여 사용하고 있습니다.

최근 지속적인 세계 밀 가격 및 유제품 원자재 수입 물류비 상승으로 인하여 부득이하게 일부 품목의 가격을 아래와 같이 소폭 조정하게 되었습니다.

• 조정 일시: 2026년 6월 1일부터
• 대상 품목:
  - 시그니처 탕종 우유 식빵: 5,200원 -> 5,500원
  - 달콤 가득 밤 식빵: 6,500원 -> 6,800원
  - 롤치즈 블랙올리브 식빵: 5,900원 -> 6,200원

앞으로도 더 훌륭한 품질과 속이 편안한 건강한 빵으로 보답하는 Bready & Co.가 되겠습니다. 고객 여러분의 깊은 양해 부탁드립니다. 감사합니다.`,
    author: '본사 운영팀',
    date: '2026-05-28',
    views: 120
  },
  {
    id: 2,
    type: 'event',
    typeStr: '이벤트',
    badgeClass: 'badge-accent',
    title: '6월 신제품 출시 기념 구매 시 모닝빵 증정 이벤트',
    content: `신선한 아침을 여는 Bready & Co.에서 다가오는 6월을 맞이하여 달콤한 허니 시나몬 페이스트리 식빵 신제품을 출시합니다!

출시를 기념하여 아래 기간 동안 시그니처 베스트 식빵 제품을 구매하시는 모든 고객분들께 100% 유기농 밀 모닝빵 2구를 선물로 증정해 드립니다.

• 이벤트 기간: 2026년 6월 1일 ~ 6월 7일 (7일간)
• 대상 매장: 본점 및 전 매장
• 혜택 내용: 밤 식빵 또는 시그니처 탕종 식빵 구매 시 매일 당일 구워낸 쫄깃 모닝빵 2구 즉시 증정!

갓 구운 빵 냄새 가득한 매장으로 향긋한 신제품 시식하러 오세요!`,
    author: '마케팅팀',
    date: '2026-05-25',
    views: 245
  },
  {
    id: 3,
    type: 'info',
    typeStr: '안내',
    badgeClass: 'badge-primary',
    title: '매주 월요일 정기 휴무 및 갓 구운 빵 나오는 시간표 안내',
    content: `Bready & Co. 본점 매장 정기 휴무 및 갓 구운 식빵 나오는 시간표를 안내해 드립니다.

효모의 활발한 대사 관리 및 쾌적한 매장 위생 정비를 위해 매주 월요일은 정기 휴무로 지정되어 운영됩니다. 이용에 불편 없으시길 바랍니다.

[ 갓 구운 식빵 시간표 (화~일) ]
• 오전 08:30 - 시그니처 탕종 우유 식빵
• 오전 10:00 - 달콤 가득 밤 식빵 & 롤치즈 블랙올리브 식빵
• 오전 11:30 - 담백 오가닉 통밀 식빵
• 오후 01:30 - 프리미엄 초코 마블 식빵, 허니 시나몬 식빵

시간 맞춰 오시면 결결이 찢어지는 따끈하고 부드러운 최상의 식빵 맛을 즐기실 수 있습니다. 감사합니다.`,
    author: '본점 점장',
    date: '2026-05-20',
    views: 184
  }
];

function Notice() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState(null);
  
  // Admin permissions simulator state
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Sync state with localStorage on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('isAdmin') === 'true';
    setIsAdminMode(adminSession);
  }, []);

  // Force toggle admin mode for simulator testing
  const handleToggleAdminMode = () => {
    const nextMode = !isAdminMode;
    setIsAdminMode(nextMode);
    localStorage.setItem('isAdmin', nextMode ? 'true' : 'false');
    if (nextMode) {
      localStorage.setItem('username', '최고 관리자');
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('username');
      localStorage.removeItem('isLoggedIn');
    }
  };

  // Filter Notices
  const filteredNotices = MOCK_NOTICES.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    return notice.type === filterType && matchesSearch;
  });

  return (
    <>
      <style>{`
        .notice-header-section {
          padding: 60px 0 20px;
          border-bottom: 2px solid var(--border);
          background-color: var(--secondary-light);
          margin-bottom: 40px;
        }

        /* Simulator Console Card (Much More Elevated) */
        .simulator-bar {
          background-color: #FAF4EB;
          border: 2px dashed var(--secondary);
          border-radius: var(--border-radius);
          padding: 24px;
          margin-bottom: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          text-align: left;
          box-shadow: 0 4px 12px rgba(111, 59, 19, 0.04);
        }

        .simulator-info {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          font-size: 0.95rem;
          color: var(--text);
          line-height: 1.5;
        }

        .simulator-info strong {
          color: var(--primary);
        }

        .simulator-toggle-btn {
          color: #ffffff !important;
          border: none;
          padding: 12px 24px;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 800;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .simulator-toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        /* Header Row with Title & Button */
        .notice-list-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 16px;
          border-bottom: 2px solid var(--border);
        }

        /* Search Filter Controls Bar */
        .search-filter-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .filter-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-btn {
          background-color: #ffffff;
          border: 2px solid var(--border);
          color: var(--text-light);
          padding: 12px 24px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .filter-btn:hover {
          color: #783F04 !important;
          border-color: #783F04 !important;
          background-color: #F7EFE5 !important;
        }

        .filter-btn-active {
          background-color: #783F04 !important; /* 100% 딥 브라운 배경 고정 */
          color: #ffffff !important;           /* 100% 화이트 텍스트 고정 */
          border-color: #783F04 !important;
          box-shadow: 0 4px 12px rgba(120, 63, 4, 0.25);
        }

        .search-box-wrapper {
          position: relative;
          width: 340px;
          max-width: 100%;
        }

        .search-input-field {
          width: 100%;
          padding: 14px 18px 14px 50px;
          border-radius: 30px;
          border: 2px solid var(--border);
          outline: none;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 600;
          background-color: #ffffff;
          transition: var(--transition);
        }

        .search-input-field:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(111, 59, 19, 0.12);
        }

        .search-icon-inside {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }

        /* Elevated Card Feed Layout (Crucial visual rework) */
        .notice-feed-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 100px;
        }

        .notice-feed-card {
          background-color: #ffffff;
          border: 1px solid var(--border);
          border-radius: var(--border-radius);
          padding: 28px;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          box-shadow: var(--shadow);
        }

        .notice-feed-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
          border-color: var(--primary);
        }

        .notice-feed-left {
          display: flex;
          align-items: center;
          gap: 24px;
          flex: 1;
        }

        @media (max-width: 640px) {
          .notice-feed-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .notice-feed-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }

        .feed-badge-wrapper {
          width: 90px;
          display: flex;
          justify-content: center;
          flex-shrink: 0;
        }

        .feed-content-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feed-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-heading);
          line-height: 1.4;
          transition: var(--transition);
        }

        .notice-feed-card:hover .feed-title {
          color: var(--primary);
        }

        .feed-meta-row {
          display: flex;
          gap: 20px;
          font-size: 0.85rem;
          color: var(--text-light);
          font-weight: 600;
          flex-wrap: wrap;
        }

        .feed-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .feed-chevron-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: var(--secondary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: var(--transition);
        }

        .notice-feed-card:hover .feed-chevron-btn {
          background-color: var(--primary);
          color: #ffffff;
          transform: scale(1.08);
        }

        /* Detail Modal */
        .notice-modal-body-wrapper {
          text-align: left;
        }

        .notice-modal-meta {
          display: flex;
          gap: 20px;
          font-size: 0.88rem;
          color: var(--text-light);
          border-bottom: 2px solid var(--border);
          padding-bottom: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          font-weight: 600;
        }

        .notice-modal-desc-content {
          font-size: 1.02rem;
          line-height: 1.8;
          color: var(--text);
          white-space: pre-wrap;
          font-weight: 500;
        }
      `}</style>

      {/* Header Info Area */}
      <section className="notice-header-section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '0', textAlign: 'left', maxWidth: '100%' }}>
            <span className="section-subtitle">news & event</span>
            <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>소식 & 이벤트</h2>
            <p className="section-desc" style={{ color: 'var(--text-light)', fontSize: '1.05rem' }}>
              Bready & Co.의 다채로운 이벤트 정보와 정직한 공지사항을 알려드립니다.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          
          {/* Admin permissions simulator (Highly visible & beautifully framed) */}
          <div className="simulator-bar">
            <div className="simulator-info">
              <ShieldAlert size={24} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '4px' }}>[가이드 & 시뮬레이터 안내]</strong>
                공지사항 등록 권한을 즉시 획득하시려면 우측 스위치를 켜시거나, 회원관리에서 최고 관리자 
                계정(계정: <span style={{ textDecoration: 'underline', color: 'var(--primary)' }}>admin@bready.com</span> / 비밀번호: <span style={{ textDecoration: 'underline', color: 'var(--primary)' }}>admin1234</span>)으로 로그인해 주십시오.
              </div>
            </div>
            <button 
              className="simulator-toggle-btn" 
              onClick={handleToggleAdminMode} 
              type="button"
              style={{ backgroundColor: isAdminMode ? '#783F04' : '#8E7D72' }}
            >
              {isAdminMode ? <CheckCircle2 size={18} /> : null}
              관리자 모드: {isAdminMode ? '활성화 (ON)' : '비활성 (OFF)'}
            </button>
          </div>

          {/* List Header Row (Title + High-Visibility Action button) */}
          <div className="notice-list-header-row">
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              등록 소식 목록 <span style={{ color: 'var(--accent)', marginLeft: '4px' }}>({filteredNotices.length})</span>
            </span>

            {isAdminMode && (
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => navigate('/notice/write')}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontWeight: 800, 
                  boxShadow: '0 4px 15px rgba(226, 135, 35, 0.25)',
                  animation: 'modalSlideUp 0.3s forwards'
                }}
              >
                <PenTool size={18} /> 새로운 공지 등록하기
              </Button>
            )}
          </div>

          {/* Search Filter Controls Bar */}
          <div className="search-filter-bar">
            {/* Filter buttons */}
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterType === 'all' ? 'filter-btn-active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                전체 소식
              </button>
              <button 
                className={`filter-btn ${filterType === 'notice' ? 'filter-btn-active' : ''}`}
                onClick={() => setFilterType('notice')}
              >
                공지사항
              </button>
              <button 
                className={`filter-btn ${filterType === 'event' ? 'filter-btn-active' : ''}`}
                onClick={() => setFilterType('event')}
              >
                이벤트
              </button>
              <button 
                className={`filter-btn ${filterType === 'info' ? 'filter-btn-active' : ''}`}
                onClick={() => setFilterType('info')}
              >
                안내사항
              </button>
            </div>

            {/* Search Box */}
            <div className="search-box-wrapper">
              <Search className="search-icon-inside" size={20} />
              <input 
                type="text" 
                className="search-input-field" 
                placeholder="제목, 본문 검색..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search notices"
              />
            </div>
          </div>

          {/* Elevated Card Feed Layout (No table, modern cards!) */}
          <div className="notice-feed-list">
            {filteredNotices.length === 0 ? (
              <Card hoverable={false} style={{ padding: '80px 20px', textAlign: 'center' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '1.05rem', fontWeight: 600 }}>
                  일치하는 게시글이 없습니다.
                </div>
              </Card>
            ) : (
              filteredNotices.map((notice) => (
                <div 
                  key={notice.id} 
                  className="notice-feed-card"
                  onClick={() => setSelectedNotice(notice)}
                >
                  <div className="notice-feed-left">
                    <div className="feed-badge-wrapper">
                      <span className={`badge ${notice.badgeClass}`} style={{ width: '100%', justifyContent: 'center', padding: '6px 12px' }}>
                        {notice.typeStr}
                      </span>
                    </div>
                    
                    <div className="feed-content-wrapper">
                      <h4 className="feed-title">{notice.title}</h4>
                      <div className="feed-meta-row">
                        <div className="feed-meta-item">
                          <User size={14} />
                          <span>작성자: <strong>{notice.author}</strong></span>
                        </div>
                        <div className="feed-meta-item">
                          <Calendar size={14} />
                          <span>등록일: {notice.date}</span>
                        </div>
                        <div className="feed-meta-item">
                          <FileText size={14} />
                          <span>조회 {notice.views}회</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="feed-chevron-btn" aria-label="View details">
                    <ChevronRight size={20} strokeWidth={2.5} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Notice Detail Modal */}
      <Modal
        isOpen={selectedNotice !== null}
        onClose={() => setSelectedNotice(null)}
        title={selectedNotice ? `${selectedNotice.typeStr} | 상세 안내` : ''}
        size="md"
      >
        {selectedNotice && (
          <div className="notice-modal-body-wrapper">
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-heading)', marginBottom: '16px', lineHeight: 1.4, fontWeight: 800 }}>
              {selectedNotice.title}
            </h3>
            
            <div className="notice-modal-meta">
              <div className="feed-meta-item">
                <User size={15} />
                <span>작성자: <strong>{selectedNotice.author}</strong></span>
              </div>
              <div className="feed-meta-item">
                <Calendar size={15} />
                <span>등록일: {selectedNotice.date}</span>
              </div>
              <div className="feed-meta-item">
                <FileText size={15} />
                <span>조회수: {selectedNotice.views}회</span>
              </div>
            </div>

            <div className="notice-modal-desc-content">
              {selectedNotice.content}
            </div>

            <div style={{ borderTop: '2px solid var(--border)', marginTop: '32px', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" size="md" onClick={() => setSelectedNotice(null)}>
                목록으로 돌아가기
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default Notice;
