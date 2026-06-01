import React from 'react';

function Footer() {
  return (
    <footer className="mt-auto py-8 bg-toss-gray-50 dark:bg-toss-dark-bg border-t border-toss-gray-200 dark:border-toss-dark-border transition-colors duration-250">
      <div className="max-w-5xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between text-xs text-toss-gray-400 dark:text-toss-gray-500 font-semibold space-y-4 md:space-y-0">
        
        {/* Disclaimers & Copyright */}
        <div className="flex flex-col space-y-1 text-center md:text-left">
          <p>© 2026 Viva Republica. Powered by Antigravity AI.</p>
          <p className="max-w-md font-medium text-[10px] leading-relaxed">
            본 플랫폼에서 제공하는 모든 금융 정보는 시뮬레이션 및 데이터 테스트 모델이며, 
            실제 투자 권유나 손실 보장의 책임을 지지 않습니다. 투자 시 유의하시기 바랍니다.
          </p>
        </div>

        {/* Support Links */}
        <div className="flex space-x-6">
          <a href="#" className="hover:text-toss-blue transition-colors">이용약관</a>
          <a href="#" className="hover:text-toss-blue transition-colors">개인정보처리방침</a>
          <a href="#" className="hover:text-toss-blue transition-colors">고객센터</a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
