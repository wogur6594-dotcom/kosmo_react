package com.jh.app;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jh.app.config.JwtTokenProvider;
import com.jh.app.member.MemberDTO;
import com.jh.app.member.MemberRepository;
import com.jh.app.board.BoardEntity;
import com.jh.app.board.BoardRepository;
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

import java.time.LocalDateTime;
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
public class BoardControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private String userToken;
    private Long targetBoardId;

    @BeforeEach
    public void setup() {
        boardRepository.deleteAll();
        memberRepository.deleteAll();

        // 1. 테스트 사용자 생성 및 토큰 발급
        MemberDTO user = new MemberDTO();
        user.setUsername("testuser");
        user.setPassword(passwordEncoder.encode("user1234"));
        user.setName("홍길동");
        user.setEmail("hong@toss.com");
        memberRepository.save(user);
        userToken = jwtTokenProvider.generateToken("testuser");

        // 2. 테스트용 기본 토론글 등록
        BoardEntity board = BoardEntity.builder()
                .title("삼성전자 HBM 분석글")
                .content("HBM3E 납품 본격화 가능성을 긍정적으로 봅니다.")
                .author("투자분석가")
                .createAt(LocalDateTime.now())
                .views(10)
                .likes(5)
                .stockSymbol("005930")
                .stockName("삼성전자")
                .build();
        BoardEntity saved = boardRepository.save(board);
        targetBoardId = saved.getId();
    }

    @Test
    @DisplayName("토론 게시물 목록 조회 성공 테스트 - GET /api/board/list")
    public void testGetBoardList() throws Exception {
        mockMvc.perform(get("/api/board/list")
                        .param("stockSymbol", "ALL")
                        .param("search", "")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.content", notNullValue()));
    }

    @Test
    @DisplayName("토론 게시물 상세 조회 성공 테스트 - GET /api/board/detail/{id}")
    public void testGetBoardDetail() throws Exception {
        mockMvc.perform(get("/api/board/detail/" + targetBoardId)
                        .param("increaseView", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.post.title", is("삼성전자 HBM 분석글")))
                .andExpect(jsonPath("$.data.post.views", is(11))); // 조회수 증가 확인
    }

    @Test
    @DisplayName("토론 게시물 작성 차단 테스트 (비로그인) - POST /api/board/write")
    public void testWriteBoardUnauthenticated() throws Exception {
        Map<String, String> request = Map.of(
                "title", "로그인 없이 쓰는 글",
                "content", "본문내용",
                "stockSymbol", "TSLA",
                "stockName", "테슬라"
        );

        mockMvc.perform(post("/api/board/write")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden()); // Security Filter에서 차단됨
    }

    @Test
    @DisplayName("토론 게시물 작성 성공 테스트 (로그인) - POST /api/board/write")
    public void testWriteBoardAuthenticated() throws Exception {
        Map<String, String> request = Map.of(
                "title", "엔비디아 액분 호재 분석",
                "content", "주식 분할 효과는 긍정적입니다.",
                "stockSymbol", "NVDA",
                "stockName", "엔비디아"
        );

        mockMvc.perform(post("/api/board/write")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.title", is("엔비디아 액분 호재 분석")))
                .andExpect(jsonPath("$.data.author", is("홍길동"))); // 작성자명 매핑 확인
    }

    @Test
    @DisplayName("게시물 공감(좋아요) 성공 테스트 - POST /api/board/like/{id}")
    public void testLikeBoard() throws Exception {
        mockMvc.perform(post("/api/board/like/" + targetBoardId)
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.likes", is(6))); // 좋아요 수 증가 확인
    }

    @Test
    @DisplayName("댓글 작성 성공 테스트 (로그인) - POST /api/board/comment/write")
    public void testWriteCommentAuthenticated() throws Exception {
        Map<String, Object> request = Map.of(
                "boardId", targetBoardId,
                "content", "공감하는 분석글입니다."
        );

        mockMvc.perform(post("/api/board/comment/write")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.content", is("공감하는 분석글입니다.")))
                .andExpect(jsonPath("$.data.author", is("홍길동"))); // 작성자명 매핑 확인
    }
}
