package com.qbyaz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class QbyazApplication {
    public static void main(String[] args) {
        SpringApplication.run(QbyazApplication.class, args);
    }
}
