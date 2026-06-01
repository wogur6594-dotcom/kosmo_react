import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { User, Wallet, Award, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';

function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('게스트 주주');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userSession = localStorage.getItem('username');
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    const adminStatus = localStorage.getItem('isAdmin') === 'true';

    if (userSession) setUsername(userSession);
    setIsLoggedIn(loginStatus);
    setIsAdmin(adminStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    alert('로그아웃 되었습니다. 게스트 상태로 전환됩니다.');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <style>{`
        .profile-container-layout {
          max-width: 900px;
          margin: 60px auto 100px;
          text-align: left;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 32px;
        }

        @media (max-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .profile-side-card {
          padding: 32px !important;
          border-radius: var(--border-radius) !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          text-align: center;
        }

        .avatar-circle {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background-color: var(--toss-blue-light);
          color: var(--toss-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          font-weight: 800;
        }

        .portfolio-holding-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--border);
        }

        .portfolio-holding-item:last-child {
          border-bottom: none;
        }
      `}</style>

      <div className="container">
        <div className="profile-container-layout">
          
          <span className="section-subtitle">my investment page</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '32px' }}>마이 투자 정보</h1>

          {isLoggedIn ? (
            <div className="profile-grid">
              
              {/* Left Column - Card Profile */}
              <div>
                <Card className="profile-side-card" hoverable={false}>
                  <div className="avatar-circle">
                    {username.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {username}님
                    </h3>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-light)', backgroundColor: 'var(--bg)', padding: '4px 10px', borderRadius: '12px' }}>
                      {isAdmin ? '최고 관리자 주주' : '일반 투자 파트너'}
                    </span>
                  </div>

                  <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                    {isAdmin && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--stock-up)', fontSize: '0.85rem', fontWeight: 800, justifyContent: 'center', marginBottom: '16px' }}>
                        <ShieldCheck size={16} /> 최고 관리자 권한 활성화 중
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      style={{ width: '100%', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}
                    >
                      <LogOut size={16} /> 안전하게 로그아웃
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Right Column - Mock Portfolio & Wallet */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Account Balance */}
                <Card hoverable={false} style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Wallet size={20} style={{ color: 'var(--toss-blue)' }} />
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 800, margin: 0 }}>나의 총 주식 예수금</h4>
                  </div>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>₩5,482,000</span>
                </Card>

                {/* Simulated Holdings */}
                <Card hoverable={false} style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <Award size={20} style={{ color: 'var(--toss-blue)' }} />
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 800, margin: 0 }}>모의 투자 보유 종목</h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="portfolio-holding-item">
                      <div>
                        <span style={{ display: 'block', fontWeight: 800, fontSize: '0.98rem' }}>삼성전자 (005930)</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>15주 보유 | 평균 단가 73,100원</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', fontWeight: 800, fontSize: '0.98rem', color: 'var(--stock-up)' }}>+1.50%</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>₩1,113,000</span>
                      </div>
                    </div>

                    <div className="portfolio-holding-item">
                      <div>
                        <span style={{ display: 'block', fontWeight: 800, fontSize: '0.98rem' }}>테슬라 (TSLA)</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>5주 보유 | 평균 단가 357,250원</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', fontWeight: 800, fontSize: '0.98rem', color: 'var(--stock-down)' }}>-3.50%</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>₩1,725,000</span>
                      </div>
                    </div>
                  </div>
                </Card>

              </div>

            </div>
          ) : (
            <Card hoverable={false} style={{ padding: '80px 20px', textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <User size={48} style={{ color: 'var(--text-light)' }} />
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    투자 파트너 정보가 없습니다
                  </h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.92rem', fontWeight: 600 }}>
                    토스증권 주주 커뮤니티 로그인을 진행하시면 모의 투자 대시보드와 프로필을 활성화하실 수 있습니다.
                  </p>
                </div>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/auth')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800, padding: '12px 30px' }}
                >
                  로그인 및 회원가입 하러 가기 <ArrowRight size={16} />
                </Button>
              </div>
            </Card>
          )}

        </div>
      </div>
    </>
  );
}

export default Profile;
