package com.jh.app.notice;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notice")
@AllArgsConstructor
@CrossOrigin("*")
public class NoticeController {

    private final NoticeService noticeService;

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> list() throws Exception {
        List<NoticeDTO> list = noticeService.getList();
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "data", list
        ));
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<Map<String, Object>> detail(@PathVariable(name = "id") Long id) throws Exception {
        NoticeDTO detail = noticeService.getDetail(id);
        if (detail == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "status", "error",
                "error", "NOT_FOUND",
                "message", "해당 공지사항을 찾을 수 없습니다."
            ));
        }
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "data", detail
        ));
    }

    @PostMapping("/write")
    public ResponseEntity<Map<String, Object>> write(@RequestBody NoticeDTO notice, Principal principal) throws Exception {
        // 비인증 사용자 방어 가드
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "status", "error",
                "error", "AUTH_UNAUTHORIZED",
                "message", "로그인이 필요합니다."
            ));
        }

        // 최고 관리자 계정('admin') 권한 정밀 검증 가드
        String username = principal.getName();
        if (!"admin".equalsIgnoreCase(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "status", "error",
                "error", "ADMIN_FORBIDDEN",
                "message", "공지사항 등록 및 편집 권한은 오직 최고 관리자 계정만 보유하고 있습니다."
            ));
        }

        // 공지 등록 실행
        NoticeDTO savedNotice = noticeService.write(notice);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "data", savedNotice,
            "message", "공지사항이 성공적으로 등록되었습니다."
        ));
    }
}
