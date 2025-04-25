package com.example.accountingGame.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        // 임시로 항상 성공하는 로그인 처리
        return "로그인 성공";
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        // 임시로 항상 성공하는 회원가입 처리
        return "회원가입 성공";
    }
}

class LoginRequest {
    private String username;
    private String password;

    // getters and setters
}

class RegisterRequest {
    private String username;
    private String password;
    private String email;

    // getters and setters
} 