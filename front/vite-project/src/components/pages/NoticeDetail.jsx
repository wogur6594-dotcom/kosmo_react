import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { ArrowLeft, User, Calendar, ShieldAlert } from 'lucide-react';

function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const MOCK_NOTICES = {
      '1': {
        title: '[점검] 해외주식 소수점 실시간 주문 서비스 시스템 점검 안내',
        content: `안녕하세요, 토스증권을 이용해 주시는 투자자 여러분.
보다 안정적이고 원활한 해외주식 소수점 실시간 주문 서비스를 제공하기 위해 대외 시스템 정기 연계 점검을 진행할 예정입니다.

점검 시간에는 해외주식 소수점 주문 및 원화 환산 가격 조회가 일시적으로 제한되오니, 투자 업무에 참고하시기 바랍니다.

• 점검 일시: 2026년 6월 7일 (일) 오전 02:00 ~ 오전 06:00 (약 4시간)
• 영향 범위: 
  - 미국 주식 소수점 실시간 매수/매도 주문 접수 중단
  - 실시간 환전 및 자산 잔고 반영 일시 지연

항상 신뢰할 수 있고 더욱 견고한 금융 서비스를 제공하기 위해 최선을 다하는 토스증권이 되겠습니다. 고객 여러분의 깊은 양해 부탁드립니다. 감사합니다.`,
        author: '토스증권 운영팀',
        date: '2026-05-28',
        typeStr: '공지'
      },
      '2': {
        title: '[이벤트] 해외 소수점 주식 무료 증정 및 거래 수수료 평생 혜택',
        content: `금융의 새로운 바람을 만드는 토스증권에서 다가오는 6월을 맞이하여 신규 투자자분들을 위한 미국 대표 우량 소수점 주식 100% 랜덤 증정 이벤트를 시작합니다!

가입 즉시 행운의 룰렛을 돌려 미국 상위 10대 기업(Apple, Microsoft, Tesla 등) 소수점 주식을 무상 지급받으세요.

• 이벤트 기간: 2026년 6월 1일 ~ 6월 30일 (한 달간)
• 참여 대상: 토스증권 생애 첫 주식 계좌 개설 고객
• 혜택 내용: 100% 당첨 미국 우량주 소수점 주식 최소 1,000원 ~ 최대 10만 원 상당 즉시 입금!

소중한 첫 시드머니, 토스증권이 제공하는 풍성한 소수점 주식 혜택과 함께 기분 좋게 시작해 보세요!`,
        author: '마케팅팀',
        date: '2026-05-25',
        typeStr: '이벤트'
      },
      '3': {
        title: '[안내] 미국 서머타임 적용에 따른 해외주식 거래 시간 변동 안내',
        content: `토스증권 해외주식 서비스를 이용해 주시는 고객 여러분께 안내해 드립니다.

미국 현지 서머타임(Daylight Saving Time) 적용 기간에 따라 미국 주식 시장의 정규 거래 및 프리마켓/애프터마켓 운영 시간이 아래와 같이 1시간 앞당겨집니다. 투자 시 착오 없으시길 바랍니다.

[ 미국 주식 거래 시간표 (서머타임 적용 기준) ]
• 프리마켓 (장전 거래): 오후 05:00 ~ 오후 10:30
• 정규 시장 거래: 오후 10:30 ~ 익일 오전 05:00
• 애프터마켓 (장후 거래): 익일 오전 05:00 ~ 오전 09:00

서머타임 해제 시에는 모든 거래 시간이 1시간씩 뒤로 이동하게 되며, 변동 시 공지사항을 통해 다시 안내해 드리겠습니다. 오늘도 성공적인 투자를 기원합니다. 감사합니다.`,
        author: '해외주식지원팀',
        date: '2026-05-20',
        typeStr: '안내'
      }
    };

    setNotice(MOCK_NOTICES[id] || {
      title: '토스증권 안내 소식',
      content: '상세 정보가 존재하지 않습니다.',
      author: '운영팀',
      date: '2026-06-01',
      typeStr: '안내'
    });
  }, [id]);

  if (!notice) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>소식을 불러오고 있습니다...</h3>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .notice-detail-layout {
          max-width: 800px;
          margin: 40px auto 100px;
          text-align: left;
        }

        .notice-main-card {
          padding: 40px !important;
          border-radius: var(--border-radius) !important;
        }

        .notice-detail-header {
          border-bottom: 2px solid var(--border);
          padding-bottom: 24px;
          margin-bottom: 28px;
        }

        .notice-detail-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.4;
          margin: 12px 0;
        }

        .notice-detail-meta {
          display: flex;
          gap: 20px;
          font-size: 0.88rem;
          color: var(--text-light);
          font-weight: 600;
        }

        .notice-detail-body {
          font-size: 1.05rem;
          line-height: 1.8;
          color: var(--text-secondary);
          white-space: pre-wrap;
          font-weight: 500;
          margin-bottom: 40px;
        }
      `}</style>

      {/* Top Nav Back Bar */}
      <div className="write-top-nav-bar" style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border)', padding: '16px 0', textAlign: 'left' }}>
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
              color: 'var(--toss-blue)'
            }}
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> 소식 목록으로 돌아가기
          </Button>
        </div>
      </div>

      <div className="container">
        <div className="notice-detail-layout">
          <Card className="notice-main-card" hoverable={false}>
            <div className="notice-detail-header">
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--toss-blue)', backgroundColor: 'var(--toss-blue-light)', padding: '4px 10px', borderRadius: '6px' }}>
                {notice.typeStr}
              </span>
              <h1 className="notice-detail-title">{notice.title}</h1>
              
              <div className="notice-detail-meta">
                <div className="meta-item-box"><User size={14} /> 작성자: <strong>{notice.author}</strong></div>
                <div className="meta-item-box"><Calendar size={14} /> {notice.date}</div>
              </div>
            </div>

            <div className="notice-detail-body">
              {notice.content}
            </div>

            <div style={{ borderTop: '2px solid var(--border)', paddingTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" size="md" onClick={() => navigate('/notice')} style={{ fontWeight: 800 }}>
                목록으로 이동
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default NoticeDetail;
