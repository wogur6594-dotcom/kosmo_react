import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { Lock, Mail, User, Phone, CheckCircle, Gift, Sparkles, Smile } from 'lucide-react';
import { api } from '../../utils/api';

function Auth() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  
  // Login Form States (Aligned with MemberDTO 'username' PK)
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup Form States (Precisely mapped to MemberDTO)
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) return;

    try {
      const response = await api.post('/api/member/login', {
        username: loginUsername,
        password: loginPassword
      });

      if (response.status === 'success') {
        const data = response.data;
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('name', data.name);
        localStorage.setItem('isLoggedIn', 'true');
        
        if (data.username === 'admin') {
          localStorage.setItem('isAdmin', 'true');
          alert('관리자 계정으로 로그인하였습니다. 이제 공지사항 등록 권한이 활성화됩니다.');
          navigate('/notice');
        } else {
          localStorage.setItem('isAdmin', 'false');
          alert(`반갑습니다! ${data.name || data.username}님, 로그인에 성공하셨습니다.`);
          navigate('/');
        }
        window.location.reload();
      } else {
        alert(response.message || '로그인에 실패하였습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('로그인 처리 중 에러가 발생했습니다. 아이디와 비밀번호를 확인해 주세요.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupUsername || !signupPassword || !signupConfirmPassword || !signupName || !signupEmail) {
      alert('모든 필수 입력 사항을 입력해 주세요.');
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (!termsAccepted) {
      alert('이용약관 및 개인정보 처리방침에 동의해 주세요.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', signupUsername);
      formData.append('password', signupPassword);
      formData.append('passwordCheck', signupConfirmPassword);
      formData.append('name', signupName);
      formData.append('email', signupEmail);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await api.postMultipart('/api/member/join', formData);

      if (response.status === 'success') {
        alert(`축하합니다! 토스증권의 회원이 되셨습니다.\n\n[가입 완료]\n아이디: ${response.data.username}\n이름: ${response.data.name}\n\n1,000원 상당의 웰컴 소수점 주식 혜택 계좌가 생성되었습니다.`);
        setActiveTab('login');
      } else {
        alert(response.message || '회원가입에 실패하였습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('회원가입 처리 중 에러가 발생했습니다. 아이디 중복 혹은 입력값을 확인해 주세요.');
    }
  };

  // Password match visual status using MemberDTO transient field equivalent
  const isPasswordMatch = signupPassword && signupConfirmPassword && signupPassword === signupConfirmPassword;

  return (
    <>
      <style>{`
        .auth-container-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 48px;
          align-items: center;
          margin: 60px auto 100px;
          max-width: 1100px;
          text-align: left;
        }

        @media (max-width: 768px) {
          .auth-container-grid {
            grid-template-columns: 1fr;
            gap: 30px;
            margin-top: 30px;
          }
        }

        /* Branding Column */
        .auth-brand-left {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .benefit-card-box {
          background-color: var(--secondary-light);
          border: 1px dashed var(--secondary);
          border-radius: var(--border-radius);
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .benefit-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #ffffff;
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow);
          flex-shrink: 0;
        }

        /* Form Column Card */
        .auth-form-card {
          padding: 0 !important;
          overflow: hidden;
        }

        .tabs-header-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid var(--border);
          background-color: var(--secondary-light);
        }

        .tab-btn {
          padding: 20px;
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text-light);
          background: none;
          border: none;
          cursor: pointer;
          transition: var(--transition);
          outline: none;
          text-align: center;
          border-bottom: 3px solid transparent;
        }

        .tab-btn:hover {
          color: var(--primary);
        }

        .tab-btn-active {
          color: var(--primary);
          border-bottom-color: var(--primary);
          background-color: #ffffff;
        }

        .form-padding-body {
          padding: 40px 32px;
        }

        .auth-input-icon-group {
          position: relative;
        }

        .auth-input-icon-group input {
          padding-left: 44px;
        }

        .auth-field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }

        .password-feedback-badge {
          display: inline-flex;
          font-size: 0.8rem;
          margin-top: 6px;
          font-weight: 600;
        }
      `}</style>

      <div className="container">
        <div className="auth-container-grid">
          {/* Left Column: Branding Benefits */}
          <div className="auth-brand-left">
            <span className="section-subtitle">toss securities</span>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--text-heading)', lineHeight: 1.3 }}>
              토스증권의<br />
              특별한 투자 파트너가 되어보세요
            </h1>
            <p style={{ color: 'var(--text-light)', fontSize: '0.98rem', lineHeight: 1.7 }}>
              회원가입 즉시 실시간 글로벌 증시 시세 조회 및 웰컴 소수점 주식 증정 이벤트에 동참하실 수 있습니다.
            </p>

            <div className="benefit-card-box">
              <div className="benefit-item">
                <div className="benefit-icon-wrapper">
                  <Gift size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-heading)', marginBottom: '4px' }}>웰컴 소수점 주식 1,000원 즉시 지급</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    가입 완료 즉시 첫 거래에 바로 사용할 수 있거나 보유 가능한 미국 우량 소수점 주식 1,000원 상당이 즉시 지급됩니다.
                  </p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon-wrapper">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-heading)', marginBottom: '4px' }}>거래 수수료 업계 최저 0.015% 혜택</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    국내외 주식 거래 시 업계 최저 수준인 0.015% 우대 수수료율이 자동 적용되어 매매 비용 부담을 대폭 덜어드립니다.
                  </p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon-wrapper">
                  <Smile size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-heading)', marginBottom: '4px' }}>매년 생일 축하 투자 지원금 100%</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    소중한 투자자님의 가장 특별한 날, 매년 생일 축하 배당주 1주 상당이 랜덤 주식 뽑기로 100% 무상 지급됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Form Card */}
          <Card className="auth-form-card" hoverable={false}>
            {/* Tabs Header */}
            <div className="tabs-header-row">
              <button 
                className={`tab-btn ${activeTab === 'login' ? 'tab-btn-active' : ''}`}
                onClick={() => setActiveTab('login')}
              >
                로그인
              </button>
              <button 
                className={`tab-btn ${activeTab === 'signup' ? 'tab-btn-active' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                회원가입
              </button>
            </div>

            {/* Login Tab Content */}
            {activeTab === 'login' && (
              <div className="form-padding-body" style={{ animation: 'modalFadeIn 0.3s forwards' }}>
                <form onSubmit={handleLoginSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="loginUsernameInput">아이디 (Username) *</label>
                    <div className="auth-input-icon-group">
                      <User className="auth-field-icon" size={18} />
                      <input 
                        id="loginUsernameInput"
                        type="text" 
                        className="form-input" 
                        placeholder="아이디를 입력하세요..." 
                        required
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="loginPasswordInput">비밀번호 *</label>
                    <div className="auth-input-icon-group">
                      <Lock className="auth-field-icon" size={18} />
                      <input 
                        id="loginPasswordInput"
                        type="password" 
                        className="form-input" 
                        placeholder="비밀번호를 입력하세요..." 
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Auto login option & Forgot link */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input type="checkbox" id="autoLoginCheck" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <label htmlFor="autoLoginCheck" style={{ cursor: 'pointer', fontWeight: 600 }}>자동 로그인</label>
                    </div>
                    <a href="#forgot" style={{ color: 'var(--primary)', fontWeight: 600 }}>비밀번호 찾기 &rarr;</a>
                  </div>

                  <Button variant="primary" type="submit" style={{ width: '100%', height: '48px', fontSize: '1rem', fontWeight: 800 }}>
                    로그인 완료
                  </Button>
                </form>
              </div>
            )}

            {/* Signup Tab Content */}
            {activeTab === 'signup' && (
              <div className="form-padding-body" style={{ animation: 'modalFadeIn 0.3s forwards' }}>
                <form onSubmit={handleSignupSubmit}>
                  
                  {/* Username (아이디) - MemberDTO PK */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="signupUsernameInput">아이디 (Username) *</label>
                    <div className="auth-input-icon-group">
                      <User className="auth-field-icon" size={18} />
                      <input 
                        id="signupUsernameInput"
                        type="text" 
                        className="form-input" 
                        placeholder="사용하실 고유 아이디..." 
                        required
                        value={signupUsername}
                        onChange={(e) => setSignupUsername(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Password - MemberDTO Column */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="signupPasswordInput">비밀번호 *</label>
                    <div className="auth-input-icon-group">
                      <Lock className="auth-field-icon" size={18} />
                      <input 
                        id="signupPasswordInput"
                        type="password" 
                        className="form-input" 
                        placeholder="비밀번호 설정..." 
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Password Check (passwordCheck) - MemberDTO Transient */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="signupConfirmPasswordInput">비밀번호 확인 *</label>
                    <div className="auth-input-icon-group">
                      <Lock className="auth-field-icon" size={18} />
                      <input 
                        id="signupConfirmPasswordInput"
                        type="password" 
                        className="form-input" 
                        placeholder="비밀번호 다시 입력..." 
                        required
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      />
                    </div>

                    {signupConfirmPassword && (
                      <span className={`password-feedback-badge ${isPasswordMatch ? 'badge-success' : 'badge-danger'}`} style={{ padding: '4px 10px', borderRadius: '12px' }}>
                        {isPasswordMatch ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={12} /> 비밀번호가 일치합니다.
                          </span>
                        ) : '비밀번호가 서로 다릅니다.'}
                      </span>
                    )}
                  </div>

                  {/* Name - MemberDTO Column */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="signupNameInput">이름 *</label>
                    <div className="auth-input-icon-group">
                      <Smile className="auth-field-icon" size={18} />
                      <input 
                        id="signupNameInput"
                        type="text" 
                        className="form-input" 
                        placeholder="실명 입력..." 
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Email - MemberDTO Column */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="signupEmailInput">이메일 계정 *</label>
                    <div className="auth-input-icon-group">
                      <Mail className="auth-field-icon" size={18} />
                      <input 
                        id="signupEmailInput"
                        type="email" 
                        className="form-input" 
                        placeholder="example@toss.com" 
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Profile Image - Optional Attachment */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="signupProfileImageInput">프로필 이미지 (선택)</label>
                    <div className="auth-input-icon-group">
                      <Smile className="auth-field-icon" size={18} />
                      <input 
                        id="signupProfileImageInput"
                        type="file" 
                        accept="image/*"
                        className="form-input" 
                        style={{ paddingLeft: '44px', paddingTop: '10px' }}
                        onChange={(e) => setProfileImage(e.target.files[0] || null)}
                      />
                    </div>
                    {profileImage && (
                      <span className="password-feedback-badge badge-success" style={{ padding: '4px 10px', borderRadius: '12px', marginTop: '8px' }}>
                        선택된 파일: {profileImage.name} ({Math.round(profileImage.size / 1024)} KB)
                      </span>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', margin: '24px 0' }}>
                    <input 
                      type="checkbox" 
                      id="termsCheck" 
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', marginTop: '3px' }}
                    />
                    <label htmlFor="termsCheck" style={{ cursor: 'pointer', fontSize: '0.82rem', lineHeight: 1.4, color: 'var(--text-light)' }}>
                      토스증권의 <strong style={{ color: 'var(--text-heading)' }}>이용약관</strong> 및 <strong style={{ color: 'var(--text-heading)' }}>개인정보 수집/이용 방침</strong>에 대해 충분히 숙지하였으며 이에 동의합니다. (필수)
                    </label>
                  </div>

                  <Button variant="secondary" type="submit" style={{ width: '100%', height: '48px', fontSize: '1rem', fontWeight: 800 }}>
                    가입 및 쿠폰 받기
                  </Button>
                </form>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

export default Auth;
