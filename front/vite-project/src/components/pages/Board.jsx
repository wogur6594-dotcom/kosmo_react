import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { Search, Calendar, User, MessageSquare, Heart, Edit3, ChevronRight } from 'lucide-react';
import { api } from '../../utils/api';

const MOCK_POSTS = []; // Legacy local storage seed removed

function Board() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState('ALL');

  // 백엔드 API로부터 필터 및 키워드가 반영된 게시물 페이징 리스트 동적 로드
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get(`/api/board/list?stockSymbol=${selectedStock}&search=${searchTerm}&page=0&size=100`);
        if (res.status === 'success' && res.data) {
          setPosts(res.data.content || []);
        }
      } catch (err) {
        console.error('토론방 목록 로드 실패:', err);
      }
    };
    fetchPosts();
  }, [selectedStock, searchTerm]);

  const filteredPosts = posts;

  return (
    <>
      <style>{`
        .board-header-section {
          padding: 60px 0 20px;
          border-bottom: 2px solid var(--border);
          background-color: var(--secondary-light);
          margin-bottom: 40px;
        }

        .board-control-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .stock-selector-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .stock-select-btn {
          background-color: var(--card-bg);
          border: 2px solid var(--border);
          color: var(--text-secondary);
          padding: 10px 20px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .stock-select-btn:hover {
          color: var(--toss-blue);
          border-color: var(--toss-blue);
          background-color: var(--toss-blue-light);
        }

        .stock-select-btn-active {
          background-color: var(--toss-blue) !important;
          color: #ffffff !important;
          border-color: var(--toss-blue) !important;
        }

        .board-search-group {
          position: relative;
          width: 320px;
          max-width: 100%;
        }

        .board-feed-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 100px;
          text-align: left;
        }

        .post-feed-card {
          background-color: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: var(--border-radius);
          padding: 28px;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .post-feed-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-hover);
          border-color: var(--primary);
        }

        .post-feed-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .post-stock-tag {
          align-self: flex-start;
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--toss-blue);
          background-color: var(--toss-blue-light);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .post-feed-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .post-feed-excerpt {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .post-meta-line {
          display: flex;
          gap: 18px;
          font-size: 0.85rem;
          color: var(--text-light);
          font-weight: 600;
          margin-top: 8px;
        }

        .meta-item-box {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .post-arrow-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--secondary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: var(--transition);
        }

        .post-feed-card:hover .post-arrow-btn {
          background-color: var(--primary);
          color: #ffffff;
          transform: scale(1.08);
        }
      `}</style>

      {/* Header section */}
      <section className="board-header-section">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '0', textAlign: 'left', maxWidth: '100%' }}>
            <span className="section-subtitle">stock discussion</span>
            <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>주주 토론 게시판</h2>
            <p className="section-desc" style={{ color: 'var(--text-light)', fontSize: '1.05rem' }}>
              토스증권 주주들과 나누는 친절하고 유익한 종목별 실시간 토론 공간입니다.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          
          {/* Controls bar */}
          <div className="board-control-row">
            <div className="stock-selector-buttons">
              <button 
                className={`stock-select-btn ${selectedStock === 'ALL' ? 'stock-select-btn-active' : ''}`}
                onClick={() => setSelectedStock('ALL')}
              >
                전체 종목
              </button>
              <button 
                className={`stock-select-btn ${selectedStock === '005930' ? 'stock-select-btn-active' : ''}`}
                onClick={() => setSelectedStock('005930')}
              >
                삼성전자
              </button>
              <button 
                className={`stock-select-btn ${selectedStock === 'TSLA' ? 'stock-select-btn-active' : ''}`}
                onClick={() => setSelectedStock('TSLA')}
              >
                테슬라
              </button>
              <button 
                className={`stock-select-btn ${selectedStock === 'NVDA' ? 'stock-select-btn-active' : ''}`}
                onClick={() => setSelectedStock('NVDA')}
              >
                엔비디아
              </button>
            </div>

            <Button 
              variant="primary" 
              onClick={() => navigate('/board/write')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}
            >
              <Edit3 size={18} /> 투자 글쓰기
            </Button>
          </div>

          <div className="board-control-row" style={{ justifyContent: 'flex-end', marginTop: '-16px', marginBottom: '24px' }}>
            <div className="board-search-group">
              <Search className="search-icon-inside" size={18} />
              <input 
                type="text" 
                className="search-input-field" 
                placeholder="검색할 토론 키워드..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Discussion feed list */}
          <div className="board-feed-list">
            {filteredPosts.length === 0 ? (
              <Card hoverable={false} style={{ padding: '80px 20px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-light)', fontWeight: 600 }}>작성된 주주 토론글이 없습니다. 첫 글의 주주가 되어보세요!</div>
              </Card>
            ) : (
              filteredPosts.map(post => (
                <div 
                  key={post.id} 
                  className="post-feed-card"
                  onClick={() => navigate(`/board/${post.id}`)}
                >
                  <div className="post-feed-left">
                    <span className="post-stock-tag">{post.stockName} ({post.stockSymbol})</span>
                    <h3 className="post-feed-title">{post.title}</h3>
                    <p className="post-feed-excerpt">{post.content}</p>
                    
                    <div className="post-meta-line">
                      <div className="meta-item-box">
                        <User size={13} />
                        <span>{post.author}</span>
                      </div>
                      <div className="meta-item-box">
                        <Calendar size={13} />
                        <span>{post.createAt ? post.createAt.substring(0, 10) : post.date}</span>
                      </div>
                      <div className="meta-item-box">
                        <MessageSquare size={13} />
                        <span>댓글 {post.comments ? post.comments.length : 0}개</span>
                      </div>
                      <div className="meta-item-box">
                        <Heart size={13} style={{ color: 'var(--stock-up)' }} />
                        <span>좋아요 {post.likes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="post-arrow-btn">
                    <ChevronRight size={18} strokeWidth={2.5} />
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>
    </>
  );
}

export default Board;
