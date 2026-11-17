package org.example.myjava.common;

/**
 * 业务异常：Service 层校验失败时抛出。
 * <p>包名统一小写（{@code common}），类名保持 UpperCamelCase。
 */
public class BusinessException extends RuntimeException {
    private int code;

    public BusinessException(String message) {
        super(message);
        this.code = 500;
    }

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    public int getCode() {
        return code;
    }
}
