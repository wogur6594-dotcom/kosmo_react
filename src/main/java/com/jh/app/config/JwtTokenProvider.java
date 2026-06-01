package com.jh.app.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long tokenValidityInMilliseconds = 3600000 * 24; // 24 hours

    public JwtTokenProvider(@Value("${JWT_SECRET:c29tZS1zZWN1cmUtc2VjcmV0LWtleS1mb3Itand0LXNpZ25pbmctdmVyeS1zZWN1cmUtYW5kLXN0cm9uZw==}") String secretString) {
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secretString);
        } catch (Exception e) {
            keyBytes = secretString.getBytes();
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + tokenValidityInMilliseconds);

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(validity)
                .signWith(key)
                .compact();
    }

    public String getUsername(String token) {
        Claims claims = getParser().parseSignedClaims(token).getPayload();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            getParser().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private JwtParser getParser() {
        return Jwts.parser()
                .verifyWith(key)
                .build();
    }
}
