package com.jh.app;

import com.jh.app.config.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void testPublicEndpointAccessibility() throws Exception {
        mockMvc.perform(get("/api/test"))
                .andExpect(status().isOk());
    }

    @Test
    void testProtectedEndpointFailsWithoutToken() throws Exception {
        mockMvc.perform(post("/api/board/write")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Test Title\",\"content\":\"Test Content\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testProtectedEndpointSucceedsWithValidToken() throws Exception {
        String token = jwtTokenProvider.generateToken("testuser_999");

        // The endpoint is protected. By passing a valid token, security filter should pass it.
        // It will return 404 NOT FOUND because the controller /api/board/write is not implemented yet,
        // which successfully proves that it bypassed the 403 FORBIDDEN security block!
        mockMvc.perform(post("/api/board/write")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Test Title\",\"content\":\"Test Content\"}"))
                .andExpect(status().isNotFound());
    }
}
