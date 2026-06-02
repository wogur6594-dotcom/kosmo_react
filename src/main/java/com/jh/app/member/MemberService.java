package com.jh.app.member;

import com.jh.app.config.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final MemberProfileRepository memberProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    private static final String UPLOAD_DIR = "D:/upload/members/";

    @Transactional
    public MemberDTO join(MemberDTO member, MultipartFile profileImage) {
        // 아이디 중복 체크
        if (memberRepository.existsById(member.getUsername())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        // 비밀번호 확인 검증
        if (member.getPasswordCheck() != null && !member.getPassword().equals(member.getPasswordCheck())) {
            throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        // 단방향 BCrypt 해싱 암호화 후 주입
        String encodedPassword = passwordEncoder.encode(member.getPassword());
        member.setPassword(encodedPassword);

        // 먼저 유저 데이터를 데이터베이스에 영속화
        MemberDTO savedMember = memberRepository.save(member);

        // 프로필 이미지가 첨부된 경우 물리 및 DB 연계 저장 처리
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                // 물리 디렉토리가 없으면 자동 생성 시도
                String uploadPath = UPLOAD_DIR;
                File dir = new File(uploadPath);
                
                // 만약 D 드라이브가 존재하지 않아 폴더 생성에 실패하는 로컬/테스트 환경인 경우
                // 워크스페이스 내의 상대경로(upload/members/)로 안전하게 자동 폴백(Fallback) 처리
                if (!dir.exists() && !dir.mkdirs()) {
                    uploadPath = "upload/members/";
                    dir = new File(uploadPath);
                    if (!dir.exists()) {
                        dir.mkdirs();
                    }
                }

                // 고유 식별 명칭(UUID)을 가미한 파일명 정의
                String originalFileName = profileImage.getOriginalFilename();
                String storedFileName = UUID.randomUUID().toString() + "_" + originalFileName;
                String filePath = uploadPath + storedFileName;
                long fileSize = profileImage.getSize();

                // 서버 디렉토리에 물리 복사 저장
                profileImage.transferTo(new File(filePath));

                // 1:1 관계의 프로필 레코드 객체 생성 및 연동
                MemberProfileDTO profile = new MemberProfileDTO();
                profile.setOriginalFileName(originalFileName);
                profile.setStoredFileName(storedFileName);
                profile.setFilePath(filePath);
                profile.setFileSize(fileSize);
                profile.setCreatedAt(LocalDateTime.now());
                profile.setMember(savedMember); // 1:1 주인 연동

                // 관계의 주인인 프로필을 DB에 저장
                memberProfileRepository.save(profile);
                savedMember.setProfile(profile); // 캐시 영속성 동기화
            } catch (Exception e) {
                throw new RuntimeException("프로필 이미지 물리 저장 도중 에러가 발생했습니다: " + e.getMessage(), e);
            }
        }

        return savedMember;
    }

    @Transactional(readOnly = true)
    public String login(String username, String password) {
        MemberDTO member = memberRepository.findById(username)
                .orElseThrow(() -> new IllegalArgumentException("아이디가 존재하지 않거나 비밀번호가 일치하지 않습니다."));

        if (!passwordEncoder.matches(password, member.getPassword())) {
            throw new IllegalArgumentException("아이디가 존재하지 않거나 비밀번호가 일치하지 않습니다.");
        }

        // JWT 토큰 생성 및 반환
        return jwtTokenProvider.generateToken(username);
    }

    @Transactional(readOnly = true)
    public MemberDTO getProfile(String username) {
        return memberRepository.findById(username)
                .orElseThrow(() -> new IllegalArgumentException("해당 회원을 찾을 수 없습니다."));
    }
}
