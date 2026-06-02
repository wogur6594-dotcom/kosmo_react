import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import { PenTool, ArrowLeft, ShieldAlert, CheckCircle2, FileText, User, ChevronRight } from 'lucide-react';
import { api } from '../../utils/api';

function NoticeWrite() {
  const navigate = useNavigate();
  const [type, setType] = useState('notice');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('토스증권 운영팀');
  const [content, setContent] = useState('');

  // Sync state with localStorage on mount to guard admin-only access
  useEffect(() => {
    const adminSession = localStorage.getItem('isAdmin') === 'true';
    if (!adminSession) {
      alert('공지사항 작성 권한은 오직 최고 관리자 계정만 보유하고 있습니다. 소식 목록으로 리다이렉트합니다.');
      navigate('/notice');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !author) {
      alert('모든 필수 입력 사항을 기입해 주세요.');
      return;
    }

    try {
      const prefix = type === 'notice' ? '[공지] ' : type === 'event' ? '[이벤트] ' : '[안내] ';
      const fullTitle = title.startsWith('[') ? title : prefix + title;

      const response = await api.post('/api/notice/write', {
        title: fullTitle,
        content: content,
        author: author
      });

      if (response.status === 'success') {
        alert('공지사항이 성공적으로 등록되었습니다.');
        navigate('/notice');
      } else {
        alert(response.message || '공지사항 등록에 실패하였습니다.');
      }
    } catch (err) {
      console.error('공지사항 등록 에러:', err);
      alert('공지사항 등록 요청 중 오류가 발생했습니다. 최고 관리자 세션이 유효한지 확인해 주십시오.');
    }
  };

  return (
    <>
      <style>{`
        /* Header section breadcrumbs styling */
        .write-top-nav-bar {
          background-color: var(--secondary-light);
          border-bottom: 2px solid var(--border);
          padding: 24px 0;
          text-align: left;
        }

        .write-container-grid {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 48px;
          margin: 48px auto 100px;
          max-width: 1200px;
          text-align: left;
        }

        @media (max-width: 992px) {
          .write-container-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            margin-top: 30px;
          }
        }

        /* Left Branding Panel */
        .write-guide-left {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .guide-card-box {
          background-color: var(--toss-blue-light);
          border: 2px dashed var(--toss-blue);
          border-radius: var(--border-radius);
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          box-shadow: var(--shadow);
        }

        .guide-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--text-light);
        }

        .guide-icon-wrapper {
          color: var(--accent);
          flex-shrink: 0;
          margin-top: 3px;
        }

        .guide-item strong {
          color: var(--text-heading);
          font-size: 1rem;
          display: block;
          margin-bottom: 4px;
          font-weight: 800;
        }

        /* Ultimate Squish-Prevention Form Fields */
        .write-form-card {
          display: block !important;
          width: 100% !important;
          padding: 44px 36px !important;
          box-shadow: var(--shadow-hover) !important;
          box-sizing: border-box !important;
        }

        .form-block-group {
          display: block !important;
          width: 100% !important;
          margin-bottom: 24px !important;
          text-align: left !important;
          box-sizing: border-box !important;
        }

        .form-block-label {
          display: block !important;
          font-size: 0.98rem !important;
          font-weight: 800 !important;
          color: var(--text-heading) !important;
          margin-bottom: 10px !important;
          letter-spacing: 0.3px;
        }

        /* 100% Width inputs with honey gold focus glow */
        .form-block-input-field {
          display: block !important;
          width: 100% !important;
          padding: 15px 18px !important;
          font-family: var(--font-sans) !important;
          font-size: 0.98rem !important;
          font-weight: 700 !important;
          color: var(--text-heading) !important;
          background-color: var(--bg) !important;
          border: 2px solid var(--border) !important;
          border-radius: var(--border-radius-sm) !important;
          outline: none !important;
          transition: var(--transition) !important;
          box-sizing: border-box !important;
        }

        .form-block-input-field:focus {
          border-color: var(--primary) !important;
          background-color: var(--card-bg) !important;
          box-shadow: 0 0 0 5px rgba(49, 130, 246, 0.18), 0 2px 8px rgba(0, 80, 255, 0.08) !important;
        }

        .form-block-input-field::placeholder {
          color: #a89a8f !important;
          font-weight: 500;
        }

        .form-block-grid-row {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 24px !important;
          width: 100% !important;
          margin-bottom: 24px !important;
          box-sizing: border-box !important;
        }

        @media (max-width: 640px) {
          .form-block-grid-row {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }

        /* Styled Dropdown select */
        .form-block-select-field {
          display: block !important;
          width: 100% !important;
          padding: 15px 18px !important;
          font-family: var(--font-sans) !important;
          font-size: 0.98rem !important;
          font-weight: 700 !important;
          color: var(--text-heading) !important;
          background-color: var(--bg) !important;
          border: 2px solid var(--border) !important;
          border-radius: var(--border-radius-sm) !important;
          outline: none !important;
          cursor: pointer;
          transition: var(--transition) !important;
          box-sizing: border-box !important;
        }

        .form-block-select-field:focus {
          border-color: var(--primary) !important;
          background-color: var(--card-bg) !important;
          box-shadow: 0 0 0 5px rgba(49, 130, 246, 0.18), 0 2px 8px rgba(0, 80, 255, 0.08) !important;
        }

      `}</style>

      {/* Top Breadcrumb Nav Bar */}
      <div className="write-top-nav-bar">
        <div className="container">
          <Button 
            variant="text" 
            onClick={() => navigate('/notice')} 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '0',
              fontWeight: 800,
              fontSize: '0.98rem',
              color: 'var(--toss-blue)'
            }}
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> 소식 목록으로 돌아가기
          </Button>
        </div>
      </div>

      <div className="container">
        <div className="write-container-grid">
          
          {/* Left Column: Admin Guidelines */}
          <div className="write-guide-left">
            <span className="section-subtitle" style={{ fontSize: '0.95rem' }}>administrator only</span>
            <h1 style={{ fontSize: '2.4rem', color: 'var(--text-heading)', lineHeight: 1.35, fontWeight: 800 }}>
              토스증권<br />
              공지사항 작성 수칙
            </h1>
            <p style={{ color: 'var(--text-light)', fontSize: '0.98rem', lineHeight: 1.7, fontWeight: 600 }}>
              새 소식과 공지글은 토스증권을 이용하는 소중한 투자자분들께 금융 정보와 혜택을 안전하게 전달하는 소통의 창구입니다.
            </p>

            <div className="guide-card-box">
              <div className="guide-item">
                <ShieldAlert className="guide-icon-wrapper" size={22} strokeWidth={2.5} />
                <div>
                  <strong>정확한 사실 기반 작성</strong>
                  <span>서비스 점검 시간, 소수점 주식 혜택 등 핵심 일정 및 금융 관련 데이터는 오타 없이 이중 확인 후 릴리즈해 주십시오.</span>
                </div>
              </div>

              <div className="guide-item">
                <CheckCircle2 className="guide-icon-wrapper" size={22} strokeWidth={2.5} />
                <div>
                  <strong>쉽고 친절한 문체 고수</strong>
                  <span>어렵고 낯선 금융 용어를 지양하고, 사용자의 관점에서 이해하기 쉽고 명확하며 따뜻한 존칭 문법을 고수해 주십시오.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Visibility Write Form Card (100% Fixed and responsive) */}
          <Card className="write-form-card" hoverable={false} style={{ display: 'block', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', borderBottom: '2px solid var(--border)', paddingBottom: '20px' }}>
              <PenTool size={24} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.45rem', color: 'var(--text-heading)', margin: 0, fontWeight: 800 }}>새 소식 등록 양식</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'block', width: '100%', boxSizing: 'border-box' }}>
              
              {/* Row 1: Select Type & Author (Forced 100% Width) */}
              <div className="form-block-grid-row">
                <div className="form-block-group">
                  <label className="form-block-label" htmlFor="noticeTypeSelect">
                    <FileText size={14} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'middle' }} /> 공지 분류 *
                  </label>
                  <select 
                    id="noticeTypeSelect"
                    className="form-block-select-field" 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="notice">공지사항 (Notice)</option>
                    <option value="event">이벤트 (Event)</option>
                    <option value="info">안내사항 (Info)</option>
                  </select>
                </div>
                
                <div className="form-block-group">
                  <label className="form-block-label" htmlFor="noticeAuthorInput">
                    <User size={14} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'middle' }} /> 작성자 명 *
                  </label>
                  <input 
                    id="noticeAuthorInput"
                    type="text" 
                    className="form-block-input-field" 
                    placeholder="예: 토스증권 운영팀" 
                    required 
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 2: Title (Forced 100% Width Block) */}
              <div className="form-block-group">
                <label className="form-block-label" htmlFor="noticeTitleInput">제목 *</label>
                <input 
                  id="noticeTitleInput"
                  type="text" 
                  className="form-block-input-field" 
                  placeholder="공지할 소식의 명확한 핵심 제목을 입력하세요..." 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Row 3: Content (Forced 100% Width Block & Vertical) */}
              <div className="form-block-group" style={{ marginBottom: '36px' }}>
                <label className="form-block-label" htmlFor="noticeContentTextarea">공지 상세 내용 *</label>
                <textarea 
                  id="noticeContentTextarea"
                  className="form-block-input-field" 
                  rows="12" 
                  style={{ resize: 'vertical', lineHeight: 1.6, minHeight: '200px' }}
                  placeholder="고객에게 상세히 설명할 공지사항 본문 내용을 문단 구분하여 성실히 작성해 주세요..." 
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', borderTop: '2px solid var(--border)', paddingTop: '28px', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => navigate('/notice')}
                  style={{ fontWeight: 800, padding: '12px 28px' }}
                >
                  작성 취소
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  style={{ fontWeight: 800, padding: '12px 32px' }}
                >
                  공지 등록 완료
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}

export default NoticeWrite;
