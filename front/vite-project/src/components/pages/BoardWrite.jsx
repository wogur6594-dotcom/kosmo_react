import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Card from '../common/Card';
import { ArrowLeft, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';

function BoardWrite() {
  const navigate = useNavigate();
  const [stockSymbol, setStockSymbol] = useState('005930');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert('모든 필수 항목을 채워주세요.');
      return;
    }

    alert(`토론글이 주주 토론방에 성공적으로 게시되었습니다!\n\n[등록 정보]\n- 종목: ${stockSymbol === '005930' ? '삼성전자' : stockSymbol === 'TSLA' ? '테슬라' : '엔비디아'}\n- 제목: ${title}`);
    navigate('/board');
  };

  return (
    <>
      <style>{`
        .write-top-nav-bar {
          background-color: var(--card-bg);
          border-bottom: 1px solid var(--border);
          padding: 16px 0;
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
          color: var(--text-secondary);
        }

        .guide-icon-wrapper {
          color: var(--primary);
          flex-shrink: 0;
          margin-top: 3px;
        }

        .guide-item strong {
          color: var(--text-primary);
          font-size: 1rem;
          display: block;
          margin-bottom: 4px;
          font-weight: 800;
        }
      `}</style>

      {/* Top Nav Back Bar */}
      <div className="write-top-nav-bar">
        <div className="container">
          <Button 
            variant="text" 
            onClick={() => navigate('/board')} 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '0',
              fontWeight: 800,
              color: 'var(--toss-blue)'
            }}
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> 토론 게시판으로 돌아가기
          </Button>
        </div>
      </div>

      <div className="container">
        <div className="write-container-grid">
          
          {/* Left Column: Guidelines */}
          <div className="write-guide-left" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <span className="section-subtitle">stock community rules</span>
            <h1 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', lineHeight: 1.35, fontWeight: 800 }}>
              토스증권<br />
              투자 커뮤니티 수칙
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7, fontWeight: 600 }}>
              건전하고 안전한 투자 토론 문화를 만들기 위해 아래 가이드라인을 반드시 지켜주십시오.
            </p>

            <div className="guide-card-box">
              <div className="guide-item">
                <AlertCircle className="guide-icon-wrapper" size={22} strokeWidth={2.5} />
                <div>
                  <strong>비방 및 허위 정보 금지</strong>
                  <span>특정 종목에 대한 고의적 선동이나 입증되지 않은 거짓 공시 유포 행위는 계정 제재 및 법적 책임을 물을 수 있습니다.</span>
                </div>
              </div>

              <div className="guide-item">
                <Sparkles className="guide-icon-wrapper" size={22} strokeWidth={2.5} />
                <div>
                  <strong>유익하고 존중하는 토론</strong>
                  <span>다양한 관점과 분석을 존중하며, 비속어 없는 품격 있고 따뜻한 어조의 금융 교류를 지향합니다.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Write Form Card */}
          <Card className="write-form-card" hoverable={false} style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: '44px 36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', borderBottom: '2px solid var(--border)', paddingBottom: '20px' }}>
              <MessageSquare size={24} style={{ color: 'var(--toss-blue)' }} />
              <h2 style={{ fontSize: '1.45rem', color: 'var(--text-primary)', margin: 0, fontWeight: 800 }}>새 토론글 쓰기</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'block', width: '100%', boxSizing: 'border-box' }}>
              
              <div className="form-block-grid-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '24px' }}>
                <div className="form-block-group">
                  <label className="form-block-label" htmlFor="stockSelectField" style={{ display: 'block', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>관련 주식 종목 *</label>
                  <select 
                    id="stockSelectField"
                    className="form-block-select-field" 
                    value={stockSymbol}
                    onChange={(e) => setStockSymbol(e.target.value)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '15px 18px',
                      borderRadius: '8px',
                      border: '2px solid var(--border)',
                      backgroundColor: 'var(--bg)',
                      fontWeight: 700,
                      outline: 'none'
                    }}
                  >
                    <option value="005930">삼성전자 (005930)</option>
                    <option value="TSLA">테슬라 (TSLA)</option>
                    <option value="NVDA">엔비디아 (NVDA)</option>
                  </select>
                </div>
              </div>

              <div className="form-block-group" style={{ marginBottom: '24px' }}>
                <label className="form-block-label" htmlFor="postTitleInput" style={{ display: 'block', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>제목 *</label>
                <input 
                  id="postTitleInput"
                  type="text" 
                  className="form-block-input-field" 
                  placeholder="주주들과 나누고 싶은 토론의 핵심 제목..." 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '15px 18px',
                    borderRadius: '8px',
                    border: '2px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                />
              </div>

              <div className="form-block-group" style={{ marginBottom: '36px' }}>
                <label className="form-block-label" htmlFor="postContentTextarea" style={{ display: 'block', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>상세 분석 및 본문 내용 *</label>
                <textarea 
                  id="postContentTextarea"
                  className="form-block-input-field" 
                  rows="10" 
                  style={{ 
                    resize: 'vertical', 
                    lineHeight: 1.6, 
                    minHeight: '200px',
                    display: 'block',
                    width: '100%',
                    padding: '15px 18px',
                    borderRadius: '8px',
                    border: '2px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                  placeholder="종목 동향 분석, 실시간 차트 소감 등 투자 의견을 상세히 작성해 주세요..." 
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '16px', borderTop: '2px solid var(--border)', paddingTop: '28px', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => navigate('/board')}
                  style={{ fontWeight: 800, padding: '12px 28px' }}
                >
                  작성 취소
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  style={{ fontWeight: 800, padding: '12px 32px' }}
                >
                  토론 등록 완료
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}

export default BoardWrite;
