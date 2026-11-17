package org.example.myjava.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.example.myjava.properties.JwtProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

/**
 * JWT 工具类：签发与解析令牌。
 * <p>命名：工具类统一用 {@code XxxUtil} 后缀（原类名 JwtUntil 是拼写错误，util 不是 until）。
 */
@Component
public class JwtUtil {

    @Autowired
    private JwtProperties jwtProperties;

    /** 签发令牌，subject 存用户 id。 */
    public String createJwtToken(String subject) {
        long now = System.currentTimeMillis();
        SecretKey key = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
        String jti = UUID.randomUUID().toString();
        return Jwts.builder()
                .issuedAt(new Date(now))
                .expiration(new Date(now + jwtProperties.getRefreshTtl().toMillis()))
                .signWith(key, Jwts.SIG.HS256)
                .issuer(jwtProperties.getIssuer())
                .audience().add(jwtProperties.getAudience()).and()
                .subject(subject)
                .id(jti)
                .compact();
    }

    /** 校验并解析令牌，返回 payload（issuer / audience / subject=userId / jti）。 */
    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8)))
                .requireIssuer(jwtProperties.getIssuer())
                .requireAudience(jwtProperties.getAudience())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
