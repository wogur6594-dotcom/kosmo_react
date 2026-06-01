package com.jh.app.test;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public Map<String, Object> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Spring Boot 3 (Java 21) Backend is running smoothly!");
        response.put("database", "Supabase PostgreSQL is fully connected!");
        response.put("platform", "Stock Information & Discussion Board");
        return response;
    }
}
