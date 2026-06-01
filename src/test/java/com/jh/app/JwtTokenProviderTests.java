package com.jh.app;

import com.jh.app.config.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class JwtTokenProviderTests {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void testTokenGenerationAndParsing() {
        String testUser = "testuser_999";
        
        // 1. Generate Token
        String token = jwtTokenProvider.generateToken(testUser);
        assertThat(token).isNotNull().isNotEmpty();
        System.out.println(">>> Generated JWT Token: " + token);

        // 2. Validate Token
        boolean isValid = jwtTokenProvider.validateToken(token);
        assertThat(isValid).isTrue();

        // 3. Extract Username
        String extractedUser = jwtTokenProvider.getUsername(token);
        assertThat(extractedUser).isEqualTo(testUser);
        System.out.println(">>> Extracted Username from JWT: " + extractedUser);

        // 4. Validate Tampered Token Fails
        // To safely tamper the token, we replace a character in the middle of the signature (avoiding trailing Base64 padding bits ignore)
        int dotIndex = token.lastIndexOf('.');
        String headerAndPayload = token.substring(0, dotIndex + 1);
        String signature = token.substring(dotIndex + 1);
        
        // Swap one character in the middle of the signature
        char[] sigChars = signature.toCharArray();
        sigChars[sigChars.length / 2] = (sigChars[sigChars.length / 2] == 'A') ? 'B' : 'A';
        String tamperedToken = headerAndPayload + new String(sigChars);

        boolean isTamperedValid = jwtTokenProvider.validateToken(tamperedToken);
        assertThat(isTamperedValid).isFalse();
        System.out.println(">>> Tampered Token validation failed correctly.");
    }
}
