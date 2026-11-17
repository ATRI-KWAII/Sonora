package org.example.myjava;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Slf4j
public class MyJavaApplication {

    public static void main(String[] args) {
        log.info("程序已经启动啦");
        SpringApplication.run(MyJavaApplication.class, args);
    }

}
