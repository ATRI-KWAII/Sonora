-- ============================================================
-- 用户信息表 sys_user
-- 对应实体：org.example.myjava.entity.User
-- 说明：本项目不使用任何自动建表（见 application.yml），表结构以本文件为准。
-- 用法：mysql -uroot -p webdata < sql/sys_user.sql
-- 可重复执行：IF NOT EXISTS，已存在时不会报错、不会改动现有数据。
-- ============================================================

CREATE TABLE IF NOT EXISTS `sys_user`
(
    `user_id`    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户编号（自增主键）',
    `name`       VARCHAR(50)     NULL COMMENT '姓名',
    `email`      VARCHAR(128)    NOT NULL COMMENT '邮箱，同时作为登录账号',
    `password`   VARCHAR(100)    NOT NULL COMMENT '密码，当前为明文，后续建议改为 BCrypt 哈希（60 位）',
    `status`     TINYINT         NOT NULL DEFAULT 1 COMMENT '账号状态：1 正常，0 删除',
    `created_at` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`user_id`),
    -- 登录用 selectOne(email + password) 查单条，邮箱重复会直接抛 TooManyResultsException，
    -- 因此必须由数据库保证唯一，而不是靠业务代码自觉。
    UNIQUE KEY `uk_sys_user_email` (`email`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户信息表';
