package com.jh.app.stock;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class KisAuthService {

    @Value("${kis.api.appkey}")
    private String appKey;

    @Value("${kis.api.appsecret}")
    private String appSecret;

    @Value("${kis.api.url}")
    private String baseUrl;

    private String cachedToken;
    private long tokenExpiryTime = 0L;

    private final RestTemplate restTemplate = new RestTemplate();

    public synchronized String getAccessToken() {
        if (appKey == null || appKey.trim().isEmpty() || appSecret == null || appSecret.trim().isEmpty()) {
            throw new IllegalStateException("KIS API Credentials are empty. Fallback required.");
        }

        long now = System.currentTimeMillis();
        // 토큰이 없거나 만료 10분 전(600,000ms)이면 새로 발급
        if (cachedToken == null || now >= tokenExpiryTime - 600000L) {
            fetchAccessToken();
        }
        return cachedToken;
    }

    private void fetchAccessToken() {
        String url = baseUrl + "/oauth2/tokenP";

        Map<String, String> body = new HashMap<>();
        body.put("grant_type", "client_credentials");
        body.put("appkey", appKey);
        body.put("appsecret", appSecret);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> resBody = response.getBody();
                this.cachedToken = (String) resBody.get("access_token");
                
                // 만료 시간 설정 (초 단위 반환되는 expires_in 활용)
                Number expiresIn = (Number) resBody.get("expires_in");
                long expiresInMs = (expiresIn != null) ? expiresIn.longValue() * 1000L : 86400000L;
                this.tokenExpiryTime = System.currentTimeMillis() + expiresInMs;
                System.out.println("[KIS API] Access Token fetched successfully. Valid for " + (expiresInMs / 1000) + " seconds.");
            } else {
                throw new RuntimeException("Failed to fetch KIS token: Status " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("[KIS API] Error fetching Access Token: " + e.getMessage());
            throw new RuntimeException("KIS Authentication API connection failed.", e);
        }
    }

    /**
     * KIS OpenAPI API 통신에 공통 필요한 HttpHeaders를 조립합니다.
     */
    public HttpHeaders buildHttpHeaders(String trId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("authorization", "Bearer " + getAccessToken());
        headers.set("appkey", appKey);
        headers.set("appsecret", appSecret);
        headers.set("tr_id", trId);
        // 모의투자(Virtual) 환경인 경우 보통 "Y" 설정(실전은 "N")
        boolean isVirtual = baseUrl.contains("vts") || baseUrl.contains("openapivts");
        headers.set("custtype", "P"); // 개인
        return headers;
    }
}
