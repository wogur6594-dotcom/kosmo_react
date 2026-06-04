package com.jh.app.board;

import com.jh.app.member.MemberDTO;
import com.jh.app.member.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/board")
@CrossOrigin(origins = "*")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private CommentRepository commentRepository;

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getBoardList(
            @RequestParam(value = "stockSymbol", defaultValue = "ALL") String stockSymbol,
            @RequestParam(value = "search", defaultValue = "") String search,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<BoardEntity> result = boardService.getList(stockSymbol, search, page, size);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", result);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<Map<String, Object>> getBoardDetail(
            @PathVariable("id") Long id,
            @RequestParam(value = "increaseView", defaultValue = "false") boolean increaseView
    ) {
        BoardEntity board = boardService.getDetail(id, increaseView);
        if (board == null) {
            Map<String, Object> errorRes = new HashMap<>();
            errorRes.put("status", "error");
            errorRes.put("message", "토론글을 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorRes);
        }

        List<CommentEntity> comments = commentRepository.findByBoard_IdOrderByCreateAtAsc(id);

        Map<String, Object> data = new HashMap<>();
        data.put("post", board);
        data.put("comments", comments);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", data);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/write")
    public ResponseEntity<Map<String, Object>> writeBoard(@RequestBody BoardEntity board) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username == null || username.equalsIgnoreCase("anonymousUser")) {
            Map<String, Object> errorRes = new HashMap<>();
            errorRes.put("status", "error");
            errorRes.put("message", "로그인이 필요한 서비스입니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorRes);
        }

        // 로그인 유저의 실제 name 값을 조회하여 작성자로 매핑
        Optional<MemberDTO> memberOpt = memberRepository.findById(username);
        String authorName = memberOpt.map(MemberDTO::getName).orElse(username);
        board.setAuthor(authorName);

        BoardEntity saved = boardService.write(board);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", saved);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/like/{id}")
    public ResponseEntity<Map<String, Object>> likeBoard(@PathVariable("id") Long id) {
        BoardEntity updated = boardService.toggleLike(id);
        if (updated == null) {
            Map<String, Object> errorRes = new HashMap<>();
            errorRes.put("status", "error");
            errorRes.put("message", "토론글을 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorRes);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", updated);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/comment/write")
    public ResponseEntity<Map<String, Object>> writeComment(@RequestBody Map<String, Object> payload) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (username == null || username.equalsIgnoreCase("anonymousUser")) {
            Map<String, Object> errorRes = new HashMap<>();
            errorRes.put("status", "error");
            errorRes.put("message", "로그인이 필요한 서비스입니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorRes);
        }

        Number boardIdNum = (Number) payload.get("boardId");
        String content = (String) payload.get("content");

        if (boardIdNum == null || content == null || content.trim().isEmpty()) {
            Map<String, Object> errorRes = new HashMap<>();
            errorRes.put("status", "error");
            errorRes.put("message", "필수 매개변수가 누락되었습니다.");
            return ResponseEntity.badRequest().body(errorRes);
        }

        // 로그인 유저의 실제 name 값을 조회하여 작성자로 매핑
        Optional<MemberDTO> memberOpt = memberRepository.findById(username);
        String authorName = memberOpt.map(MemberDTO::getName).orElse(username);

        try {
            CommentEntity savedComment = boardService.writeComment(boardIdNum.longValue(), content, authorName);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("data", savedComment);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorRes = new HashMap<>();
            errorRes.put("status", "error");
            errorRes.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorRes);
        }
    }
}
