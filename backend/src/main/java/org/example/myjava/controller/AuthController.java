package org.example.myjava.controller;

import org.example.myjava.common.Result;
import org.example.myjava.dto.UserLoginDTO;
import org.example.myjava.dto.UserRegisterDTO;
import org.example.myjava.entity.User;
import org.example.myjava.service.UserService;
import org.example.myjava.util.JwtUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 认证接口：注册、登录。
 * <p>URL 规范：
 * <ul>
 *   <li>模块前缀 /api/auth：个人网站前后端一起部署、没有第三方客户端，不需要 API 版本号</li>
 *   <li>注册 / 登录本质是“动作”，不属于纯 CRUD，放在 auth 模块下用动词是 REST 的允许例外；
 *       比原来 /api/user/register、/api/user/login 把动作塞进用户资源更清晰</li>
 *   <li>两者都会改变服务端状态，必须用 POST；原实现是 GET + @RequestBody，双重违规（GET 不应带 body）</li>
 * </ul>
 * 接口清单：
 * <pre>
 * POST /api/auth/register   注册
 * POST /api/auth/login      登录，返回 JWT 令牌
 * </pre>
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 注册：POST /api/auth/register
     * <p>请求体：{"email":"...","password":"..."}
     */
    @PostMapping("/register")
    public Result<?> register(@RequestBody UserRegisterDTO userRegisterDTO) {
        userService.register(userRegisterDTO.getEmail(), userRegisterDTO.getPassword());
        return Result.ok("ok");
    }

    /**
     * 登录：POST /api/auth/login
     * <p>请求体：{"email":"...","password":"..."}，成功返回 JWT 字符串。
     */
    @PostMapping("/login")
    public Result<?> login(@RequestBody UserLoginDTO userLoginDTO) {
        User user = userService.login(userLoginDTO);
        // 登录成功之后签发 Jwt 令牌
        String jwtToken = jwtUtil.createJwtToken(String.valueOf(user.getUserId()));
        return Result.ok(jwtToken);
    }
}
