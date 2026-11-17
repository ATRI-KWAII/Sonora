package org.example.myjava.config;

import jakarta.servlet.DispatcherType;
import org.example.myjava.security.JwtAuthenticationFilter;
import org.example.myjava.util.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 配置：无状态 JWT 认证。
 * <p>白名单路径必须和 Controller 上的映射保持一致：
 * 注册 / 登录是免认证接口，其余请求都需要携带 JWT。
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class JwtConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, JwtUtil jwtUtil) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // 放行容器内部的 ERROR 转发（/error），否则 400/404/500 都会被安全链二次拦截成 403，
                        // 客户端只能看到空的 403，看不到真正的错误信息
                        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                        // 认证接口免登录：POST /api/auth/login、POST /api/auth/register
                        .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/register").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(new JwtAuthenticationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
