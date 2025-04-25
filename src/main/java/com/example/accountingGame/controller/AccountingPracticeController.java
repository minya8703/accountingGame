package com.example.accountingGame.controller;

import com.example.accountingGame.dto.AccountingPracticeDto;
import com.example.accountingGame.service.AccountingPracticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/accounting/practice")
public class AccountingPracticeController {

    @Autowired
    private AccountingPracticeService practiceService;

    @GetMapping("/random")
    public ResponseEntity<AccountingPracticeDto> getRandomPractice() {
        return ResponseEntity.ok(practiceService.getRandomPractice());
    }
} 