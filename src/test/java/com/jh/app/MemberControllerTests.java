package com.jh.app;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jh.app.config.JwtTokenProvider;
import com.jh.app.member.MemberDTO;
import com.jh.app.member.MemberRepository;
import com.jh.app.member.MemberProfileRepository;
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
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class MemberControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MemberProfileRepository memberProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        // 자식 테이블(외래키 소유) 데이터를 먼저 삭제하여 제약조건 위반 방지
        memberProfileRepository.deleteAll();
        memberRepository.deleteAll();

        // 임시 테스트 계정 하나 등록해 둠
        MemberDTO testUser = new MemberDTO();
        testUser.setUsername("testuser");
        testUser.setPassword(passwordEncoder.encode("testpass123"));
        testUser.setName("테스터");
        testUser.setEmail("testuser@toss.com");
        memberRepository.save(testUser);
    }

    @Test
    @DisplayName("회원가입 성공 테스트 - POST /api/member/join (Multipart)")
    public void testJoinSuccess() throws Exception {
        org.springframework.mock.web.MockMultipartFile mockFile = new org.springframework.mock.web.MockMultipartFile(
                "profileImage",
                "test_avatar.png",
                "image/png",
                "test-image-content".getBytes()
        );

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart("/api/member/join")
                        .file(mockFile)
                        .param("username", "newuser")
                        .param("password", "newpass123")
                        .param("passwordCheck", "newpass123")
                        .param("name", "신규가입자")
                        .param("email", "newuser@toss.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.username", is("newuser")))
                .andExpect(jsonPath("$.data.password", nullValue())) // 비밀번호 노출 안 되는지 검증
                .andExpect(jsonPath("$.message", is("회원가입이 완료되었습니다.")));
    }

    @Test
    @DisplayName("회원가입 실패 테스트 (아이디 중복) - POST /api/member/join (Multipart)")
    public void testJoinFailureDuplicate() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart("/api/member/join")
                        .param("username", "testuser") // 이미 setup에서 등록됨
                        .param("password", "newpass123")
                        .param("passwordCheck", "newpass123")
                        .param("name", "중복가입자")
                        .param("email", "duplicate@toss.com"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is("error")))
                .andExpect(jsonPath("$.error", is("JOIN_FAILED")))
                .andExpect(jsonPath("$.message", is("이미 사용 중인 아이디입니다.")));
    }

    @Test
    @DisplayName("로그인 성공 테스트 - POST /api/member/login")
    public void testLoginSuccess() throws Exception {
        Map<String, String> loginReq = Map.of(
                "username", "testuser",
                "password", "testpass123"
        );

        mockMvc.perform(post("/api/member/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.username", is("testuser")))
                .andExpect(jsonPath("$.data.name", is("테스터")))
                .andExpect(jsonPath("$.data.email", is("testuser@toss.com")))
                .andExpect(jsonPath("$.message", is("로그인에 성공하였습니다.")));
    }

    @Test
    @DisplayName("로그인 실패 테스트 (비밀번호 오기입) - POST /api/member/login")
    public void testLoginFailurePassword() throws Exception {
        Map<String, String> loginReq = Map.of(
                "username", "testuser",
                "password", "wrongpass"
        );

        mockMvc.perform(post("/api/member/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is("error")))
                .andExpect(jsonPath("$.error", is("LOGIN_UNAUTHORIZED")))
                .andExpect(jsonPath("$.message", is("아이디가 존재하지 않거나 비밀번호가 일치하지 않습니다.")));
    }

    @Test
    @DisplayName("프로필 조회 성공 테스트 - GET /api/member/profile")
    public void testGetProfileSuccess() throws Exception {
        String token = jwtTokenProvider.generateToken("testuser");

        mockMvc.perform(get("/api/member/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.username", is("testuser")))
                .andExpect(jsonPath("$.data.name", is("테스터")))
                .andExpect(jsonPath("$.data.email", is("testuser@toss.com")));
    }

    @Test
    @DisplayName("프로필 조회 실패 테스트 (토큰 없음) - GET /api/member/profile")
    public void testGetProfileFailureNoToken() throws Exception {
        mockMvc.perform(get("/api/member/profile"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is("error")))
                .andExpect(jsonPath("$.error", is("AUTH_UNAUTHORIZED")));
    }
}
