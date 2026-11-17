package org.example.myjava.common;

import lombok.Data;

/**
 * 统一返回结果。
 * <p>@Data 由 Lombok 在编译期生成 getter / setter / toString / equals / hashCode。
 * <p>字段命名：code（业务码）、msg（提示语）、data（数据），JSON 序列化后即为
 * {@code {"code":1,"msg":"success","data":...}}。
 */
@Data
public class Result<T> {
    private int code;      // 返回码：成功返回 1，失败返回 0
    private String msg;    // 返回结果的文字说明
    private T data;        // 返回的数据

    public static <T> Result<T> ok(T data) {
        Result<T> result = new Result<>();
        result.setCode(1);
        result.setMsg("success");
        result.setData(data);
        return result;
    }

    public static <T> Result<T> fail(String msg) {
        Result<T> result = new Result<>();
        result.setCode(0);
        result.setMsg(msg);
        return result;
    }
}
