import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { ArrowLeft, User, Calendar, MessageSquare, Heart, Send, BarChart2 } from 'lucide-react';

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Generate Mock Post Details Based on ID from localStorage
  useEffect(() => {
    const MOCK_POST_LIST = [
      {
        id: 1,
        title: '삼성전자 오늘 시외 상승 이유 아시는 분 계신가요?',
        content: '엔비디아 HBM 공급망 진입 루머가 또 도는 것 같네요. 이번에는 진짜 확정일지 궁금합니다. 평단 76,000원에 물려있는데 드디어 탈출각 주나요?',
        author: '개미왕자',
        date: '2026-06-01',
        views: 452,
        likes: 24,
        stockSymbol: '005930',
        stockName: '삼성전자'
      },
      {
        id: 2,
        title: '테슬라 이번 2분기 인도량 예측치 분석해봅니다',
        content: '기가 상하이 가동률 및 미국 현지 프로모션 추이 고려했을 때, 애널리스트 평균 컨센서스인 43만 대 수준은 가뿐히 넘어설 것으로 보입니다. FSD 12.4 버전 롤아웃 지연이 변수이지만 장기 관점은 매우 우상향입니다.',
        author: '엘론머스크팬',
        date: '2026-06-01',
        views: 890,
        likes: 72,
        stockSymbol: 'TSLA',
        stockName: '테슬라'
      },
      {
        id: 3,
        title: '엔비디아 액분 이후 매수 타이밍 고민되네요',
        content: '단기 과열 양상 같기도 하고, 주식 분할 이후 150불 선에서 횡보하다가 3분기 실적 시즌 앞두고 다시 전고점 돌파 쏠 것 같네요. 그냥 매일 적립식 매수로 대응하는 게 최선일까요?',
        author: '반도체러버',
        date: '2026-05-31',
        views: 612,
        likes: 38,
        stockSymbol: 'NVDA',
        stockName: '엔비디아'
      }
    ];

    const rawPosts = localStorage.getItem('toss_board_posts');
    let posts = [];
    if (rawPosts) {
      posts = JSON.parse(rawPosts);
    } else {
      localStorage.setItem('toss_board_posts', JSON.stringify(MOCK_POST_LIST));
      posts = MOCK_POST_LIST;
    }

    const targetPost = posts.find(p => String(p.id) === String(id)) || {
      title: '일반 주주 토론글',
      content: '본문 내용이 존재하지 않거나 찾을 수 없습니다.',
      author: '비공개 주주',
      date: '2026-06-01',
      views: 12,
      likes: 2,
      stockSymbol: '005930',
      stockName: '삼성전자'
    };

    setPost(targetPost);
    setLikesCount(targetPost.likes);

    // Initial mock comments
    setComments([
      { id: 1, author: 'HBM전문가', content: '공식 입장이 나기 전까진 중립 기어 박는 게 최고입니다.', date: '2026-06-01' },
      { id: 2, author: '존버가승리', content: '74층 주주인데 이번엔 진짜 뚫어주길 기도합니다.', date: '2026-06-01' }
    ]);
  }, [id]);

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount(likesCount - 1);
      setHasLiked(false);
    } else {
      setLikesCount(likesCount + 1);
      setHasLiked(true);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      id: comments.length + 1,
      author: localStorage.getItem('username') || '게스트 주주',
      content: commentInput,
      date: new Date().toISOString().split('T')[0]
    };

    setComments([...comments, newComment]);
    setCommentInput('');
  };

  if (!post) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>글 정보를 불러오고 있습니다...</h3>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .post-detail-layout {
          max-width: 800px;
          margin: 40px auto 100px;
          text-align: left;
        }

        .post-main-card {
          padding: 40px !important;
          border-radius: var(--border-radius) !important;
          margin-bottom: 24px;
        }

        .post-detail-header {
          border-bottom: 2px solid var(--border);
          padding-bottom: 24px;
          margin-bottom: 28px;
        }

        .post-detail-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.4;
          margin: 12px 0;
        }

        .post-detail-meta {
          display: flex;
          gap: 20px;
          font-size: 0.88rem;
          color: var(--text-light);
          font-weight: 600;
        }

        .post-detail-body {
          font-size: 1.05rem;
          line-height: 1.8;
          color: var(--text-secondary);
          white-space: pre-wrap;
          font-weight: 500;
          margin-bottom: 40px;
        }

        .post-action-row {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid var(--border);
          padding-top: 24px;
        }

        /* Comment Section */
        .comments-header {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 20px;
        }

        .comments-list-box {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }

        .comment-item {
          background-color: var(--bg);
          padding: 20px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .comment-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          color: var(--text-light);
          font-weight: 700;
        }

        .comment-input-box-wrapper {
          display: flex;
          gap: 12px;
          align-items: center;
        }
      `}</style>

      {/* Top Nav Back Bar */}
      <div className="write-top-nav-bar" style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border)', padding: '16px 0', textAlign: 'left' }}>
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
            <ArrowLeft size={18} strokeWidth={2.5} /> 주주 토론방으로 돌아가기
          </Button>
        </div>
      </div>

      <div className="container">
        <div className="post-detail-layout">
          
          {/* Main Post Card */}
          <Card className="post-main-card" hoverable={false}>
            <div className="post-detail-header">
              <span 
                style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 800, 
                  color: 'var(--toss-blue)', 
                  backgroundColor: 'var(--toss-blue-light)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/stock/${post.stockSymbol}`)}
              >
                <BarChart2 size={13} style={{ marginRight: '5px', display: 'inline', verticalAlign: 'middle' }} />
                {post.stockName} ({post.stockSymbol}) 시세 보러 가기 &rarr;
              </span>
              <h1 className="post-detail-title">{post.title}</h1>
              
              <div className="post-detail-meta">
                <div className="meta-item-box"><User size={14} /> 작성자: <strong>{post.author}</strong></div>
                <div className="meta-item-box"><Calendar size={14} /> {post.date}</div>
                <div className="meta-item-box">조회 {post.views}회</div>
              </div>
            </div>

            <div className="post-detail-body">
              {post.content}
            </div>

            <div className="post-action-row">
              <Button 
                variant={hasLiked ? 'primary' : 'outline'} 
                size="md"
                onClick={handleLike}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}
              >
                <Heart size={16} fill={hasLiked ? '#ffffff' : 'none'} style={{ color: hasLiked ? '#ffffff' : 'var(--stock-up)' }} />
                공감 {likesCount}
              </Button>
            </div>
          </Card>

          {/* Comments Section */}
          <Card hoverable={false} style={{ padding: '36px' }}>
            <h3 className="comments-header">주주 댓글 ({comments.length})</h3>

            <div className="comments-list-box">
              {comments.length === 0 ? (
                <div style={{ padding: '20px', color: 'var(--text-light)', fontWeight: 600 }}>아직 남겨진 주주의 지혜가 없습니다. 의견을 더해주세요!</div>
              ) : (
                comments.map(c => (
                  <div key={c.id} className="comment-item">
                    <div className="comment-meta">
                      <span>{c.author}</span>
                      <span>{c.date}</span>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{c.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="comment-input-box-wrapper">
              <input 
                type="text" 
                className="form-input" 
                placeholder="따뜻하고 건전한 투자 의견을 나누어 보세요..." 
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                style={{ flex: 1, height: '48px', paddingLeft: '16px', borderRadius: '12px' }}
              />
              <Button 
                variant="primary" 
                type="submit" 
                style={{ height: '48px', width: '48px', padding: 0, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Send comment"
              >
                <Send size={18} />
              </Button>
            </form>
          </Card>

        </div>
      </div>
    </>
  );
}

export default BoardDetail;
