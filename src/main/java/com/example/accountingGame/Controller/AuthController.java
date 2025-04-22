package com.example.accountingGame.controller;

import com.example.accountingGame.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");
            
            log.info("로그인 시도: username={}", username);
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );

            String token = jwtTokenProvider.createToken(username);
            log.info("로그인 성공: username={}", username);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", username);

            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            log.error("로그인 실패: error={}", e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("message", "로그인에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            log.error("로그인 중 예외 발생: error={}", e.getMessage());
            Map<String, String> response = new HashMap<>();
            response.put("message", "서버 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
} 