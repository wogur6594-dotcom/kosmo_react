import React, { useState } from 'react';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Lock, MessageCircle, PenTool, CheckCircle, Clock } from 'lucide-react';

const MOCK_QNAS = [
  {
    id: 1,
    category: '단체주문',
    title: '어린이집 행사용 단체 주문 문의드려요.',
    author: '김선아',
    date: '2026-05-28',
    status: 'replied',
    statusStr: '답변완료',
    isPrivate: false,
    content: '다음 주 목요일(6월 4일) 오전 9시까지 시그니처 탕종 우유 식빵 20개와 모닝빵 10봉지 단체 주문이 가능할까요? 혹시 마포 본점 매장으로 직접 수령하러 가면 할인 혜택이나 서비스 모닝빵 등이 적용되는지도 궁금합니다. 결제는 카드 결제 예정입니다.',
    answer: {
      author: 'Bready 본점 운영팀',
      date: '2026-05-28',
      content: `안녕하세요, 김선아 고객님! Bready & Co.를 찾아주셔서 진심으로 감사드립니다.

문의하신 6월 4일 오전 9시 수령 단체 주문은 가능합니다. 
저희 탕종 식빵은 전날 밤부터 저온 발효하여 당일 새벽에 굽기 때문에, 단체 수량 확보를 위해 최소 3일 전인 6월 1일까지 최종 확정 및 예약을 해주시면 차질 없이 갓 구워낸 가장 촉촉한 식빵으로 준비해 드리겠습니다.

[ 단체 주문 혜택 안내 ]
1. 본점 직접 수령 시 총 구매 금액의 5% 상당 금액 할인 또는 그에 해당하는 탕종 모닝빵 서비스를 증정해 드립니다.
2. 매장에서 바로 카드 결제 및 현금영수증 발행 모두 가능합니다.

추가적인 디테일 조율을 위해 기재해 주신 연락처로 저희 담당자가 금일 오후 중으로 전화를 드릴 예정입니다. 정성을 다해 맛있게 준비하겠습니다. 감사합니다!`
    }
  },
  {
    id: 2,
    category: '성분문의',
    title: '밀가루 알레르기가 있는데 통밀 식빵은 글루텐 프리인가요?',
    author: '이현우',
    date: '2026-05-27',
    status: 'replied',
    statusStr: '답변완료',
    isPrivate: false,
    content: '글루텐 민감증이 좀 있는 편입니다. 담백 오가닉 통밀 식빵의 경우 100% 통밀이나 호밀로만 만들어져서 밀가루 프리(글루텐 프리)인 제품인지 궁금합니다.',
    answer: {
      author: '베이킹 연구소',
      date: '2026-05-27',
      content: `안녕하세요, 이현우 고객님. Bready & Co. 베이킹 팀입니다.

저희 '담백 오가닉 통밀 식빵'에 대해 문의해 주셨군요. 결론부터 말씀드리면, 해당 제품은 아쉽게도 **글루텐 프리 제품이 아닙니다.**

저희 통밀 식빵은 정제된 백밀가루 대신 영양이 살아있는 거친 통밀가루와 호밀가루를 섞어 구수함과 식이섬유를 높였으나, 통밀과 호밀 자체에 밀 단백질인 글루텐이 기본적으로 내포되어 있습니다. 
또한 빵의 부드럽고 쫄깃한 식감과 볼륨감을 유지하기 위해 소량의 유기농 강력분 밀가루가 배합되어 있으므로, 밀가루 알레르기나 중증 셀리악병이 있으신 분들께는 섭취를 권장해 드리지 않습니다.

글루텐 프리 빵을 찾으시는 고객님들을 위해 100% 국산 쌀가루와 타피오카 전분으로 만드는 프리미엄 쌀 식빵 라인업을 현재 열심히 연구 개발 중에 있으니, 머지않아 신제품으로 인사드릴 수 있도록 노력하겠습니다. 감사합니다.`
    }
  },
  {
    id: 3,
    category: '매장문의',
    title: '비밀 질문입니다.',
    author: '박정민',
    date: '2026-05-26',
    status: 'pending',
    statusStr: '답변대기',
    isPrivate: true,
    content: '비공개 질문글의 세부 내용 내용입니다.',
    answer: null
  }
];

function Qna() {
  const [qnas, setQnas] = useState(MOCK_QNAS);
  const [expandedId, setExpandedId] = useState(null);
  
  // New Q&A Modal States
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('일반문의');
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newIsPrivate, setNewIsPrivate] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Private Lock Verification States
  const [unlockId, setUnlockId] = useState(null);
  const [unlockPassword, setUnlockPassword] = useState('');

  const handleToggleAccordion = (qna) => {
    if (qna.isPrivate && expandedId !== qna.id) {
      // Prompt password modal for private questions
      setUnlockId(qna.id);
      setUnlockPassword('');
      return;
    }

    if (expandedId === qna.id) {
      setExpandedId(null);
    } else {
      setExpandedId(qna.id);
    }
  };

  const handleVerifyPassword = () => {
    // Dummy verification logic
    if (unlockPassword === '1234') {
      setExpandedId(unlockId);
      setUnlockId(null);
    } else {
      alert('비밀번호가 올바르지 않습니다. (예시: 1234)');
    }
  };

  const handleCreateQna = (e) => {
    e.preventDefault();
    if (!newTitle || !newAuthor || !newContent) {
      alert('모든 필수 정보를 입력해 주세요.');
      return;
    }

    const newQnaItem = {
      id: qnas.length + 1,
      category: newCategory,
      title: newTitle,
      author: newAuthor,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      statusStr: '답변대기',
      isPrivate: newIsPrivate,
      content: newContent,
      answer: null
    };

    setQnas([newQnaItem, ...qnas]);
    setIsWriteModalOpen(false);

    // Reset Form fields
    setNewCategory('일반문의');
    setNewTitle('');
    setNewAuthor('');
    setNewContent('');
    setNewIsPrivate(false);
    setNewPassword('');
    
    alert('질문이 정상적으로 등록되었습니다. 본사 관리자가 신속하게 답변해 드리겠습니다.');
  };

  return (
    <>
      <style>{`
        .qna-intro-section {
          padding: 60px 0 20px;
        }

        .qna-write-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        /* Accordion List Table */
        .qna-list-card {
          margin-bottom: 80px;
          padding: 0;
          overflow: hidden;
        }

        .qna-header-row {
          display: grid;
          grid-template-columns: 100px 100px 1fr 120px 100px 100px;
          background-color: var(--secondary-light);
          padding: 16px 24px;
          border-bottom: 2px solid var(--border);
          font-weight: 700;
          color: var(--text-heading);
          text-align: center;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .qna-header-row { display: none; }
        }

        .qna-item-box {
          border-bottom: 1px solid var(--border);
        }

        .qna-item-box:last-child {
          border-bottom: none;
        }

        .qna-main-row {
          display: grid;
          grid-template-columns: 100px 100px 1fr 120px 100px 100px;
          padding: 18px 24px;
          align-items: center;
          cursor: pointer;
          transition: var(--transition);
          text-align: center;
          font-size: 0.95rem;
        }

        .qna-main-row:hover {
          background-color: var(--secondary-light);
        }

        @media (max-width: 768px) {
          .qna-main-row {
            grid-template-columns: 1fr;
            text-align: left;
            gap: 10px;
            padding: 20px;
          }
        }

        .qna-title-col {
          text-align: left;
          font-weight: 600;
          color: var(--text-heading);
          display: flex;
          align-items: center;
          gap: 8px;
          padding-left: 20px;
        }

        @media (max-width: 768px) {
          .qna-title-col { padding-left: 0; }
        }

        /* Detail Panel styling */
        .qna-expanded-panel {
          background-color: #FAF9F6;
          border-top: 1px dashed var(--border);
          padding: 30px 48px;
          animation: slideDownPanel 0.3s ease-out forwards;
          text-align: left;
        }

        @media (max-width: 768px) {
          .qna-expanded-panel { padding: 20px; }
        }

        @keyframes slideDownPanel {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .qna-question-body {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .qna-body-icon {
          color: var(--accent);
          flex-shrink: 0;
        }

        .qna-answer-body {
          display: flex;
          gap: 16px;
          background-color: #ffffff;
          border: 1px solid var(--border);
          border-radius: var(--border-radius-sm);
          padding: 24px;
          box-shadow: var(--shadow);
        }

        .qna-answer-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-light);
          margin-bottom: 8px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 8px;
        }

        /* Status Badge */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: bold;
        }
      `}</style>

      {/* Header Area */}
      <section className="qna-intro-section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '20px' }}>
            <span className="section-subtitle">Q&A board</span>
            <h2 className="section-title">질문 & 답변</h2>
            <p className="section-desc">Bready & Co.의 건강 식빵에 대한 의문점이나 단체 주문, 매장 건의 사항 등을 질문해 주세요.</p>
          </div>
        </div>
      </section>

      {/* Write Bar Area */}
      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="qna-write-bar">
            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>총 <strong>{qnas.length}</strong>개의 문의 사항이 접수되었습니다.</span>
            <Button variant="primary" onClick={() => setIsWriteModalOpen(true)}>
              <PenTool size={16} style={{ marginRight: '8px' }} /> 질문 등록하기
            </Button>
          </div>

          {/* Qna Accordion Card */}
          <Card className="qna-list-card" hoverable={false}>
            {/* Header Columns */}
            <div className="qna-header-row">
              <div>번호</div>
              <div>문의 분류</div>
              <div style={{ textAlign: 'left', paddingLeft: '20px' }}>제목</div>
              <div>작성자</div>
              <div>등록일</div>
              <div>처리 상태</div>
            </div>

            {/* List Rows */}
            <div className="qna-list-wrapper">
              {qnas.map((qna, idx) => (
                <div key={qna.id} className="qna-item-box">
                  <div 
                    className="qna-main-row"
                    onClick={() => handleToggleAccordion(qna)}
                  >
                    {/* ID */}
                    <div style={{ color: 'var(--text-light)' }}>{qna.id}</div>
                    
                    {/* Category */}
                    <div>
                      <span className="badge badge-primary">{qna.category}</span>
                    </div>
                    
                    {/* Title */}
                    <div className="qna-title-col">
                      {qna.isPrivate && <Lock size={15} style={{ color: 'var(--accent)' }} />}
                      <span>{qna.title}</span>
                    </div>
                    
                    {/* Author */}
                    <div>{qna.author}</div>
                    
                    {/* Date */}
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{qna.date}</div>
                    
                    {/* Status */}
                    <div>
                      {qna.status === 'replied' ? (
                        <span className="badge badge-success status-badge">
                          <CheckCircle size={12} /> {qna.statusStr}
                        </span>
                      ) : (
                        <span className="badge badge-accent status-badge">
                          <Clock size={12} /> {qna.statusStr}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Content Panel */}
                  {expandedId === qna.id && (
                    <div className="qna-expanded-panel">
                      {/* Question Content */}
                      <div className="qna-question-body">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="qna-body-icon"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                        <div>
                          <h4 style={{ fontSize: '1rem', color: 'var(--text-heading)', marginBottom: '8px' }}>질문 내용</h4>
                          <p style={{ fontSize: '0.95rem', color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                            {qna.content}
                          </p>
                        </div>
                      </div>

                      {/* Answer Content */}
                      {qna.answer ? (
                        <div className="qna-answer-body">
                          <MessageCircle size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div className="qna-answer-meta">
                              <span>답변자: <strong>{qna.answer.author}</strong></span>
                              <span>답변일: {qna.answer.date}</span>
                            </div>
                            <p style={{ fontSize: '0.92rem', color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                              {qna.answer.content}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="qna-answer-body" style={{ borderLeft: '3px solid var(--accent)', backgroundColor: 'var(--accent-light)' }}>
                          <Clock size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                            현재 점장 및 본사 담당팀이 질문 내용을 검토 중입니다. 신속하게 고소한 답변을 준비하겠습니다.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Unlock Password Modal */}
      <Modal
        isOpen={unlockId !== null}
        onClose={() => setUnlockId(null)}
        title="비공개 글 보기 비밀번호 확인"
        size="sm"
      >
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '20px' }}>
            비밀번호를 입력해 주십시오. (개발 시뮬레이션용 비밀번호: <strong>1234</strong>)
          </p>
          
          <div className="form-group">
            <label className="form-label" htmlFor="unlockPasswordInput">비밀번호</label>
            <input 
              id="unlockPasswordInput"
              type="password" 
              className="form-input" 
              placeholder="비밀번호 입력..." 
              value={unlockPassword}
              onChange={(e) => setUnlockPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <Button variant="outline" onClick={() => setUnlockId(null)} style={{ flex: 1 }}>취소</Button>
            <Button variant="primary" onClick={handleVerifyPassword} style={{ flex: 1 }}>확인</Button>
          </div>
        </div>
      </Modal>

      {/* Write Question Modal */}
      <Modal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        title="새로운 질문 등록하기"
        size="md"
      >
        <form onSubmit={handleCreateQna} style={{ textAlign: 'left' }}>
          {/* Row 1: Category & Author */}
          <div className="grid grid-2" style={{ gap: '16px', marginBottom: '8px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="newCategorySelect">문의 분류</label>
              <select 
                id="newCategorySelect"
                className="sort-select" 
                style={{ width: '100%', borderRadius: '8px' }}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option value="일반문의">일반문의</option>
                <option value="단체주문">단체주문 문의</option>
                <option value="성분문의">성분/칼로리 문의</option>
                <option value="매장문의">매장/예약 문의</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="newAuthorInput">작성자 명 *</label>
              <input 
                id="newAuthorInput"
                type="text" 
                className="form-input" 
                placeholder="이름 입력..." 
                required 
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="newTitleInput">질문 제목 *</label>
            <input 
              id="newTitleInput"
              type="text" 
              className="form-input" 
              placeholder="제목을 명확하게 기재해 주세요..." 
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          {/* Row 3: Content */}
          <div className="form-group">
            <label className="form-label" htmlFor="newContentTextarea">질문 내용 *</label>
            <textarea 
              id="newContentTextarea"
              className="form-input" 
              rows="6" 
              style={{ resize: 'vertical' }}
              placeholder="구체적인 질문 내용을 입력하세요..." 
              required
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            ></textarea>
          </div>

          {/* Row 4: Private Option */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <input 
              type="checkbox" 
              id="privateCheck" 
              checked={newIsPrivate}
              onChange={(e) => setNewIsPrivate(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="privateCheck" style={{ fontWeight: 600, color: 'var(--text-heading)', cursor: 'pointer' }}>
              비밀글로 등록하기
            </label>
          </div>

          {/* Conditional Password input */}
          {newIsPrivate && (
            <div className="form-group" style={{ animation: 'modalFadeIn 0.2s forwards' }}>
              <label className="form-label" htmlFor="newPasswordInput">비밀글 비밀번호 (숫자 4자리) *</label>
              <input 
                id="newPasswordInput"
                type="password" 
                maxLength="4"
                className="form-input" 
                placeholder="비밀번호 4자리 설정 (예: 1234)" 
                required={newIsPrivate}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          )}

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '20px', justifyContent: 'flex-end' }}>
            <Button variant="outline" type="button" onClick={() => setIsWriteModalOpen(false)}>취소</Button>
            <Button variant="primary" type="submit">등록 완료</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Qna;
