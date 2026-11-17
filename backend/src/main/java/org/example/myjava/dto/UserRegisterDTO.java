package org.example.myjava.dto;

import lombok.Data;

/**
 * 注册请求参数。
 * <p>@Data 生成 getEmail / getPassword 等，Spring 反序列化 JSON 时会用到。
 */
@Data
public class UserRegisterDTO {
    private String email;
    private String password;
}
