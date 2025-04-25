package com.example.accountingGame.service;

import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    public boolean validateUser(String username, String password) {
        // 임시로 항상 true 반환
        return true;
    }
    
    public boolean registerUser(String username, String password, String email) {
        // 임시로 항상 true 반환
        return true;
    }
} 