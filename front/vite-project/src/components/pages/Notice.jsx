import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Search, Calendar, User, Info, FileText, PenTool, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { api } from '../../utils/api';

function Notice() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState(null);
  
  // Admin permissions simulator state
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Sync state with localStorage and load database notices
  useEffect(() => {
    const adminSession = localStorage.getItem('isAdmin') === 'true';
    setIsAdminMode(adminSession);
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/notice/list');
      if (response.status === 'success') {
        // DB 소식 매핑 튜닝 (UI에 적합한 가상 서브 타입 부여)
        const mappedData = (response.data || []).map((notice, idx) => {
          let type = 'notice';
          let typeStr = '공지';
          let badgeClass = 'badge-danger';

          if (notice.title.includes('이벤트') || notice.title.includes('선물')) {
            type = 'event';
            typeStr = '이벤트';
            badgeClass = 'badge-accent';
          } else if (notice.title.includes('안내') || notice.title.includes('시간') || notice.title.includes('서머타임')) {
            type = 'info';
            typeStr = '안내';
            badgeClass = 'badge-primary';
          }

          return {
            ...notice,
            type,
            typeStr,
            badgeClass,
            date: notice.createAt ? notice.createAt.substring(0, 10) : '2026-06-02',
            views: 10 + (idx * 4) // 임시 시뮬레이션 조회수
          };
        });
        
        // 최신순(역순)으로 정렬
        setNotices(mappedData.reverse());
      } else {
        console.error('소식 목록 로드 실패:', response.message);
      }
    } catch (err) {
      console.error('소식 목록 연동 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  // Force toggle admin mode for simulator testing
  const handleToggleAdminMode = () => {
    const nextMode = !isAdminMode;
    setIsAdminMode(nextMode);
    localStorage.setItem('isAdmin', nextMode ? 'true' : 'false');
    if (nextMode) {
      localStorage.setItem('username', 'admin');
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('username');
      localStorage.removeItem('isLoggedIn');
    }
  };

  // Filter Notices
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    return notice.type === filterType && matchesSearch;
  });

  const handleSelectNotice = async (notice) => {
    try {
      const response = await api.get(`/api/notice/detail/${notice.id}`);
      if (response.status === 'success') {
        setSelectedNotice({
          ...response.data,
          typeStr: notice.typeStr,
          badgeClass: notice.badgeClass,
          date: notice.date,
          views: notice.views
        });
      } else {
        console.error('상세정보 로딩 실패:', response.message);
        setSelectedNotice(notice); // Fallback
      }
    } catch (err) {
      console.error('상세정보 연동 에러:', err);
      setSelectedNotice(notice); // Fallback
    }
  };

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
          background-color: var(--toss-blue-light);
          border: 2px dashed var(--toss-blue);
          border-radius: var(--border-radius);
          padding: 24px;
          margin-bottom: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          text-align: left;
          box-shadow: 0 4px 12px rgba(49, 130, 246, 0.04);
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
          color: var(--toss-blue) !important;
          border-color: var(--toss-blue) !important;
          background-color: var(--toss-blue-light) !important;
        }

        .filter-btn-active {
          background-color: var(--toss-blue) !important; /* 100% 딥 블루 배경 고정 */
          color: #ffffff !important;           /* 100% 화이트 텍스트 고정 */
          border-color: var(--toss-blue) !important;
          box-shadow: 0 4px 12px rgba(49, 130, 246, 0.25);
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
              토스증권의 중요한 공지사항 및 다양한 투자 혜택 이벤트를 알려드립니다.
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
                계정(계정: <span style={{ textDecoration: 'underline', color: 'var(--primary)' }}>admin</span> / 비밀번호: <span style={{ textDecoration: 'underline', color: 'var(--primary)' }}>admin1234</span>)으로 로그인해 주십시오.
              </div>
            </div>
            <button 
              className="simulator-toggle-btn" 
              onClick={handleToggleAdminMode} 
              type="button"
              style={{ backgroundColor: isAdminMode ? 'var(--toss-blue)' : 'var(--text-tertiary)' }}
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
                  onClick={() => handleSelectNotice(notice)}
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
