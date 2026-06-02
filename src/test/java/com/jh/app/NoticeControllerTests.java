package com.jh.app;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jh.app.config.JwtTokenProvider;
import com.jh.app.member.MemberDTO;
import com.jh.app.member.MemberRepository;
import com.jh.app.notice.NoticeDTO;
import com.jh.app.notice.NoticeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class NoticeControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private String userToken;
    private String adminToken;
    private Long targetNoticeId;

    @BeforeEach
    public void setup() {
        noticeRepository.deleteAll();
        memberRepository.deleteAll();

        // 1. 일반 사용자 생성 및 토큰 발급
        MemberDTO normalUser = new MemberDTO();
        normalUser.setUsername("normaluser");
        normalUser.setPassword(passwordEncoder.encode("user1234"));
        normalUser.setName("일반회원");
        normalUser.setEmail("normal@toss.com");
        memberRepository.save(normalUser);
        userToken = jwtTokenProvider.generateToken("normaluser");

        // 2. 최고 관리자 계정 생성 및 토큰 발급
        MemberDTO adminUser = new MemberDTO();
        adminUser.setUsername("admin");
        adminUser.setPassword(passwordEncoder.encode("admin1234"));
        adminUser.setName("최고관리자");
        adminUser.setEmail("admin@toss.com");
        memberRepository.save(adminUser);
        adminToken = jwtTokenProvider.generateToken("admin");

        // 3. 테스트용 초기 공지글 한 건 등록
        NoticeDTO notice = new NoticeDTO();
        notice.setTitle("[공지] 토스증권 정기 서머타임 점검 안내");
        notice.setContent("안녕하세요. 정기 시스템 점검 소식입니다.");
        notice.setAuthor("운영팀");
        NoticeDTO saved = noticeRepository.save(notice);
        targetNoticeId = saved.getId();
    }

    @Test
    @DisplayName("공지사항 목록 조회 성공 테스트 - GET /api/notice/list (비로그인 허용)")
    public void testGetNoticeList() throws Exception {
        mockMvc.perform(get("/api/notice/list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data", notNullValue()));
    }

    @Test
    @DisplayName("공지사항 상세 조회 성공 테스트 - GET /api/notice/detail/{id} (비로그인 허용)")
    public void testGetNoticeDetail() throws Exception {
        mockMvc.perform(get("/api/notice/detail/" + targetNoticeId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.title", is("[공지] 토스증권 정기 서머타임 점검 안내")))
                .andExpect(jsonPath("$.data.author", is("운영팀")));
    }

    @Test
    @DisplayName("공지사항 작성 실패 테스트 (비로그인) - POST /api/notice/write")
    public void testWriteNoticeUnauthenticated() throws Exception {
        Map<String, String> request = Map.of(
                "title", "해커의 가짜 공지",
                "content", "공지사항 무단 주입 시도",
                "author", "Hacker"
        );

        mockMvc.perform(post("/api/notice/write")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden()); // Security Filter에서 우선적으로 튕김
    }

    @Test
    @DisplayName("공지사항 작성 실패 테스트 (일반 사용자 거부) - POST /api/notice/write")
    public void testWriteNoticeForbiddenForUser() throws Exception {
        Map<String, String> request = Map.of(
                "title", "일반 회원의 공지 등록",
                "content", "작성이 차단되어야 합니다.",
                "author", "일반유저"
        );

        mockMvc.perform(post("/api/notice/write")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden()) // 403 Forbidden 리턴 검증
                .andExpect(jsonPath("$.status", is("error")))
                .andExpect(jsonPath("$.error", is("ADMIN_FORBIDDEN")))
                .andExpect(jsonPath("$.message", is("공지사항 등록 및 편집 권한은 오직 최고 관리자 계정만 보유하고 있습니다.")));
    }

    @Test
    @DisplayName("공지사항 작성 성공 테스트 (최고 관리자 승인) - POST /api/notice/write")
    public void testWriteNoticeSuccessForAdmin() throws Exception {
        Map<String, String> request = Map.of(
                "title", "[이벤트] 신규 가입 시 미국 우량주 소수점 주식 100% 당첨 룰렛 기회!",
                "content", "행운의 미국 주식을 지금 바로 무상 지급 받으세요.",
                "author", "토스증권 마케팅팀"
        );

        mockMvc.perform(post("/api/notice/write")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.title", is("[이벤트] 신규 가입 시 미국 우량주 소수점 주식 100% 당첨 룰렛 기회!")))
                .andExpect(jsonPath("$.data.author", is("토스증권 마케팅팀")))
                .andExpect(jsonPath("$.message", is("공지사항이 성공적으로 등록되었습니다.")));
    }
}
