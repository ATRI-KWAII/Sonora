package org.example.myjava.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 用户实体，对应 sys_user 表（MyBatis-Plus）。
 * <p>项目只用 MyBatis-Plus 一个 ORM：表名 / 列名由 MP 注解显式声明，
 * 不依赖"驼峰自动转下划线"的默认推导。
 */
@Data
@TableName("sys_user")
public class User {

    /** 主键：用户编号，对应 BIGINT UNSIGNED AUTO_INCREMENT；AUTO 策略要求 Java 侧为数值类型 */
    @TableId(value = "user_id", type = IdType.AUTO)
    private Long userId;

    /** 姓名 */
    private String name;

    /** 邮箱 */
    private String email;

    /** 密码 */
    private String password;

    /** 账号状态 1 : 正常 , 0 : 删除 */
    private long status;
}
