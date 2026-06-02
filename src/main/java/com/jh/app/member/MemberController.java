package com.jh.app.member;

import lombok.RequiredArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // API 명세서의 공통 응답 규격 구현
    @Getter
    public static class ApiResponse<T> {
        private final String status;
        private final T data;
        private final String message;
        private final String error;

        private ApiResponse(String status, T data, String message, String error) {
            this.status = status;
            this.data = data;
            this.message = message;
            this.error = error;
        }

        public static <T> ApiResponse<T> success(T data, String message) {
            return new ApiResponse<>("success", data, message, null);
        }

        public static <T> ApiResponse<T> success(T data) {
            return success(data, "요청이 성공적으로 완료되었습니다.");
        }

        public static ApiResponse<Void> error(String errorCode, String message) {
            return new ApiResponse<>("error", null, message, errorCode);
        }
    }

    @Getter
    @Setter
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @PostMapping(value = "/join", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> join(
            @ModelAttribute MemberDTO member,
            @RequestParam(value = "profileImage", required = false) org.springframework.web.multipart.MultipartFile profileImage
    ) {
        try {
            MemberDTO joinedMember = memberService.join(member, profileImage);
            joinedMember.setPassword(null);
            joinedMember.setPasswordCheck(null);
            return ResponseEntity.ok(ApiResponse.success(joinedMember, "회원가입이 완료되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("JOIN_FAILED", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("SERVER_ERROR", "서버 에러가 발생했습니다: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String token = memberService.login(loginRequest.getUsername(), loginRequest.getPassword());
            MemberDTO profile = memberService.getProfile(loginRequest.getUsername());

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("token", token);
            responseData.put("username", profile.getUsername());
            responseData.put("name", profile.getName());
            responseData.put("email", profile.getEmail());

            return ResponseEntity.ok(ApiResponse.success(responseData, "로그인에 성공하였습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(ApiResponse.error("LOGIN_UNAUTHORIZED", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("SERVER_ERROR", "서버 에러가 발생했습니다."));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("AUTH_UNAUTHORIZED", "로그인이 필요합니다."));
        }

        try {
            String username = authentication.getName();
            MemberDTO profile = memberService.getProfile(username);
            profile.setPassword(null);
            profile.setPasswordCheck(null);
            return ResponseEntity.ok(ApiResponse.success(profile));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("PROFILE_FAILED", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("SERVER_ERROR", "서버 에러가 발생했습니다."));
        }
    }
}
