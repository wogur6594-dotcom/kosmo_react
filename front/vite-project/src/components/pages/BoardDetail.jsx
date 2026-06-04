import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { ArrowLeft, User, Calendar, MessageSquare, Heart, Send, BarChart2 } from 'lucide-react';
import { api } from '../../utils/api';

function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // 백엔드 API로부터 상세글 정보 및 댓글 목록 로드
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/api/board/detail/${id}?increaseView=true`);
        if (res.status === 'success' && res.data) {
          const { post, comments } = res.data;
          setPost(post);
          setComments(comments || []);
          setLikesCount(post.likes);
        }
      } catch (err) {
        console.error('상세조회 실패:', err);
      }
    };
    fetchDetail();
  }, [id]);

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    try {
      const res = await api.post(`/api/board/like/${id}`);
      if (res.status === 'success' && res.data) {
        setLikesCount(res.data.likes);
        setHasLiked(true);
      }
    } catch (err) {
      console.error('공감 처리 실패:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.');
      navigate('/auth');
      return;
    }

    try {
      const res = await api.post('/api/board/comment/write', {
        boardId: Number(id),
        content: commentInput
      });
      if (res.status === 'success' && res.data) {
        setComments([...comments, res.data]);
        setCommentInput('');
      } else {
        alert(res.message || '댓글 등록 실패');
      }
    } catch (err) {
      console.error('댓글 등록 실패:', err);
      alert('댓글 등록 중 오류가 발생했습니다. 로그인을 확인해 주세요.');
    }
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
                <div className="meta-item-box"><Calendar size={14} /> {post.createAt ? post.createAt.substring(0, 10) : post.date}</div>
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
                      <span>{c.createAt ? c.createAt.substring(0, 10) : c.date}</span>
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
