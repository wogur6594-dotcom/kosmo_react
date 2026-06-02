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
    private final ProfileImageService profileImageService;

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
            // ProfileImageService를 활용해 물리 저장소 보관 및 DTO 생성을 위임
            MemberProfileDTO profile = profileImageService.saveProfileImage(profileImage, "members");
            if (profile != null) {
                profile.setMember(savedMember); // 1:1 주인 연동
                // 관계의 주인인 프로필을 DB에 저장
                memberProfileRepository.save(profile);
                savedMember.setProfile(profile); // 캐시 영속성 동기화
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
